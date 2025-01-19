export interface Job {
    customerEmail: string | undefined,
    companyEmail: string | undefined
    title: string,
    description: string,
    categories: string[],
    subcategories: string[]| undefined,
    images: File[] | undefined,
    budget: number | undefined
}