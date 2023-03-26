


export function timeConverter(updatedAt){
    const date = new Date(updatedAt);
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();

    return `${month} ${day}`
}