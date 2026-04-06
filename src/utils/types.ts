export type ObjectType = {
    id: string 
    division: string 
    name: string
    path: string
    description: string
    rights: string
    properties: {
        [key:string]: {
            title: string 
            type: string
            rights?: string
        }
    }
}