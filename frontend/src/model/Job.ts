export interface Job {
    id: number | undefined,
    title: string
    description: string,
    categories: string[],
    subcategories: string[],
    images: File[] | undefined,
    budget: number | undefined
}