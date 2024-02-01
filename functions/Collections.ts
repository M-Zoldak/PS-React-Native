export const filterOutItem = (items: any[], item: any): any[] => {
  return items.filter((i) => i.id != item.id);
};
