import test from 'node:test';
import assert from 'node:assert/strict';
import { createBlobStorage, type BlobClient } from '../lib/blobStore';

test('私有 Blob 保存整张卡片，最新指针和零张照片读取始终绕过缓存', async () => {
  const db = new Map<string,string>();
  const reads: string[] = [];
  const writes: string[] = [];
  const client: BlobClient = {
    async get(path,options) {
      assert.equal(options.access,'private'); assert.equal(options.useCache,false);
      reads.push(path);
      return db.has(path) ? {stream:new Response(db.get(path)).body} : null;
    },
    async put(path,body,options) {
      assert.equal(options.access,'private'); assert.equal(options.allowOverwrite,true);
      writes.push(path); db.set(path,body);
    },
  };
  const storage=createBlobStorage(client);
  const card={id:'test_blob',name:'测试寿星',photos:[{url:'data:image/jpeg;base64,test'}]};
  await storage.write(card);
  assert.deepEqual(writes,['birthday-v3/cards/test_blob.json','birthday-v3/cards/latest.json']);
  assert.deepEqual(await storage.read('latest'),card);
  await storage.write({...card,photos:[]});
  assert.deepEqual((await storage.read('latest'))?.photos,[]);
  assert.equal(await storage.read('missing_card'),null);
  assert.ok(reads.includes('birthday-v3/cards/test_blob.json'));
});

test('私有 Blob 的任一步写入失败都不能确认分享成功', async () => {
  let count=0;
  const storage=createBlobStorage({
    async get(){return null;},
    async put(){if(++count===2)throw new Error('模拟最近指针写入失败');},
  });
  await assert.rejects(storage.write({id:'test_failure',photos:[]}),/模拟/);
});
