import { DashboardStats } from "@/types/models"

export const mockDashboardStats: DashboardStats = {
    classesTaken: 15,
    classesGiven: 45,
    hoursTeaching: 120,
    progressLevel: 75
}

export const chartDataHours = [
    { month: 'Ene', hours: 8 },
    { month: 'Feb', hours: 12 },
    { month: 'Mar', hours: 15 },
    { month: 'Abr', hours: 18 },
    { month: 'May', hours: 22 },
    { month: 'Jun', hours: 20 },
]

export const chartDataSkills = [
    { skill: 'React', value: 35 },
    { skill: 'TypeScript', value: 25 },
    { skill: 'Node.js', value: 20 },
    { skill: 'Python', value: 15 },
    { skill: 'Otros', value: 5 },
]
