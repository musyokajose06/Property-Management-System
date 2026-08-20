export const money = (value) => `KES ${Number(value).toLocaleString()}`

export const initials = (name) => name.split(' ').map((part) => part[0]).join('').slice(0, 2)
