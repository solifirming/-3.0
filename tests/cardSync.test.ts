import test from 'node:test';
import assert from 'node:assert/strict';
import { enqueueCardSave } from '../src/cardSaveQueue';
import { normalizePhotos } from '../src/photoState';

test('删除全部照片后保持空数组，清除旧预设且保留替换照片', () => {
  assert.deepEqual(normalizePhotos([]), []);
  assert.deepEqual(normalizePhotos(undefined), []);
  const replaced = { id: 'photo-snow', url: 'data:image/jpeg;base64,test', title: '用户照片' };
  assert.deepEqual(normalizePhotos([
    { id: 'photo-snow', url: 'https://images.unsplash.com/preset' }, replaced,
  ]), [replaced]);
  const six = Array.from({length: 6}, (_, i) => ({ id: 'custom_' + i, url: 'photo-' + i }));
  assert.deepEqual(normalizePhotos(six), six);
});

test('同一卡片串行提交，较晚的空相册写入不能被旧照片覆盖', async () => {
  const original = globalThis.fetch;
  const written: unknown[] = [];
  let release: () => void;
  const firstResponse = new Promise<void>(resolve => { release = resolve; });
  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(options!.body as string);
    written.push(body.photos);
    if (written.length === 1) await firstResponse;
    return Response.json({ success: true });
  };
  try {
    const first = enqueueCardSave('test_order', { id: 'test_order', photos: [{url:'first'}] });
    const second = enqueueCardSave('test_order', { id: 'test_order', photos: [] });
    await new Promise(resolve => setTimeout(resolve, 10));
    assert.equal(written.length, 1);
    release!();
    await Promise.all([first, second]);
    assert.deepEqual(written, [[{url:'first'}], []]);
  } finally { globalThis.fetch = original; }
});

test('保存失败会拒绝分享，之后完整重试仍能成功', async () => {
  const original = globalThis.fetch;
  let count = 0;
  globalThis.fetch = async () => ++count === 1
    ? Response.json({ success: false }, {status:500})
    : Response.json({ success: true });
  try {
    await assert.rejects(enqueueCardSave('test_retry', {photos:[]}), /云端保存失败/);
    await enqueueCardSave('test_retry', {photos:[]});
    assert.equal(count, 2);
    globalThis.fetch = async () => Response.json({success:false});
    await assert.rejects(enqueueCardSave('test_no_confirmation', {}), /未确认/);
    globalThis.fetch = async () => new Response('', {status:413});
    await assert.rejects(enqueueCardSave('test_too_large', {}), /总大小/);
  } finally { globalThis.fetch = original; }
});
