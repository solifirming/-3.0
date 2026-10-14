import test from 'node:test';
import assert from 'node:assert/strict';
import save from '../api/cards';
import get from '../api/cards/[id]';
import latest from '../api/cards/latest';
import { type ApiResponse } from '../lib/cardStore';

function response() {
  const output = { code: 200, headers: {} as Record<string,string>, body: null as any };
  const res: ApiResponse = {
    status(code) { output.code = code; return res; },
    setHeader(key,value) { output.headers[key] = value; },
    json(body) { output.body = body; },
  };
  return {output,res};
}

test('Vercel 保存、指定卡片和最近卡片读取，零张相片保持为空', async () => {
  const originalFetch = globalThis.fetch;
  const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
  const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example.invalid';
  process.env.UPSTASH_REDIS_REST_TOKEN = '仅用于内存测试的占位文本';
  const db = new Map<string,string>();
  globalThis.fetch = async (url, options) => {
    const command = JSON.parse(options!.body as string);
    if (String(url).endsWith('/multi-exec')) {
      for (const item of command) db.set(item[1],item[2]);
      return Response.json(command.map(() => ({result:'OK'})));
    }
    return Response.json({result:db.get(command[1]) ?? null});
  };
  try {
    const first = response();
    const six = Array.from({length:6},(_,i)=>({id:'photo_'+i,url:'data:image/jpeg;base64,test'+i}));
    await save({method:'POST',body:{id:'test_card',name:'测试寿星',photos:six}},first.res);
    assert.equal(first.output.code,200); assert.equal(first.output.body.success,true);
    const read = response(); await get({method:'GET',query:{id:'test_card'}},read.res);
    assert.deepEqual(read.output.body.card.photos,six);
    const last = response(); await latest({method:'GET'},last.res);
    assert.equal(last.output.body.card.id,'test_card');
    const empty = response(); await save({method:'POST',body:{id:'test_card',photos:[]}},empty.res);
    assert.equal(empty.output.body.card.name,'测试寿星');
    const emptyRead = response(); await get({method:'GET',query:{id:'test_card'}},emptyRead.res);
    assert.deepEqual(emptyRead.output.body.card.photos,[]);
    const missing = response(); await get({method:'GET',query:{id:'another_card'}},missing.res);
    assert.equal(missing.output.body.card,null);
    assert.equal(read.output.headers['Cache-Control'],'no-store');
    db.set('birthday-v3:card:latest',JSON.stringify({id:'legacy_card',photos:[]}));
    const legacy = response(); await latest({method:'GET'},legacy.res);
    assert.equal(legacy.output.body.card.id,'legacy_card');
    const invalid = response(); await save({method:'POST',body:{id:'../unsafe',photos:[]}},invalid.res);
    assert.equal(invalid.output.code,400);
    const large = response(); await save({method:'POST',body:{id:'test_card',photos:[{url:'中'.repeat(300000)}]}},large.res);
    assert.equal(large.output.code,413);
    const wrongMethod = response(); await save({method:'GET'},wrongMethod.res);
    assert.equal(wrongMethod.output.code,405);
    globalThis.fetch = async url => String(url).endsWith('/multi-exec')
      ? Response.json([{result:'OK'},{error:'事务未全部确认'}]) : Response.json({result:null});
    const failed = response(); await save({method:'POST',body:{id:'test_failed',photos:[]}},failed.res);
    assert.equal(failed.output.code,503); assert.equal(failed.output.body.success,false);
    globalThis.fetch = async () => new Response('',{status:401});
    const denied = response(); await latest({method:'GET'},denied.res);
    assert.equal(denied.output.code,503); assert.equal(denied.output.body.success,false);
  } finally {
    globalThis.fetch=originalFetch;
    if(originalUrl===undefined)delete process.env.UPSTASH_REDIS_REST_URL;else process.env.UPSTASH_REDIS_REST_URL=originalUrl;
    if(originalToken===undefined)delete process.env.UPSTASH_REDIS_REST_TOKEN;else process.env.UPSTASH_REDIS_REST_TOKEN=originalToken;
  }
});

test('缺少数据库配置时返回失败，不伪造本地保存为云端成功', async () => {
  const names=['UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN','KV_REST_API_URL','KV_REST_API_TOKEN','BLOB_STORE_ID','BLOB_READ_WRITE_TOKEN'];
  const previous=names.map(name=>process.env[name]);
  names.forEach(name=>delete process.env[name]);
  try {
    const res=response(); await latest({method:'GET'},res.res);
    assert.equal(res.output.code,503);assert.equal(res.output.body.success,false);
  } finally {names.forEach((name,i)=>{if(previous[i]===undefined)delete process.env[name];else process.env[name]=previous[i];});}
});
