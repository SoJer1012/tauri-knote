export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function generateId() {
  // 生成一个部分由时间戳组合的随机数
  const part1 = (new Date().getTime() & 0xffff).toString(16);
  const part2 = Math.random().toString(16).slice(2);

  // 组合生成唯一ID
  return part1 + "-" + part2;
}
