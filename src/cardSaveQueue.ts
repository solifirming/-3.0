// 同一卡片串行保存，避免旧请求最后完成而覆盖新照片。
const pending = new Map<string, Promise<void>>();
export function enqueueCardSave(id: string, payload: Record<string, unknown>): Promise<void> {
  const previous = pending.get(id) || Promise.resolve();
  const job = previous.catch(() => {}).then(async () => {
    const res = await fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(res.status === 413
      ? '照片总大小超出服务器限制，请压缩图片后重试'
      : `云端保存失败（HTTP ${res.status}），请重试`);
    const result = await res.json() as { success?: boolean };
    if (!result?.success) throw new Error('服务器未确认保存成功，请重试');
  });
  pending.set(id, job);
  void job.finally(() => { if (pending.get(id) === job) pending.delete(id); }).catch(() => {});
  return job;
}
