import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // Get total count of charities
        const totalCount = await prisma.charity.count()

        if (totalCount === 0) {
            return NextResponse.json(
                { error: 'No charities found' },
                { status: 404 }
            )
        }

        // Generate a random skip value
        const randomSkip = Math.floor(Math.random() * totalCount)

        // Get a random charity using skip and take
        const randomCharity = await prisma.charity.findFirst({
            skip: randomSkip,
            include: {
                categories: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        })

        if (!randomCharity) {
            return NextResponse.json(
                { error: 'Failed to fetch random charity' },
                { status: 500 }
            )
        }

        return NextResponse.json(randomCharity)
    } catch (error) {
        console.error('Error fetching random charity:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
