import dayjs from 'dayjs'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import { gte, lte, and, count, eq, sql } from 'drizzle-orm'

export async function getWeekPendingGoals() {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )

  const goalsCompletionsCounts = db.$with('goals_completions_counts').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCounts: count(goalCompletions.id).as('completion_counts')
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  const pendingGoals = await db
    .with(goalsCreatedUpToWeek, goalsCompletionsCounts)
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount: sql`
            COALESCE(${goalsCompletionsCounts.completionCounts}, 0)
        `.mapWith(Number)
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(
      goalsCompletionsCounts,
      eq(goalsCompletionsCounts.goalId, goalsCreatedUpToWeek.id)
    )

  return {
    pendingGoals
  }
}
