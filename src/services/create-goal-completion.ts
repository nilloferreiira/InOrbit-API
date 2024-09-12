import dayjs from 'dayjs'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import { count, gte, lte, and, eq, sql } from 'drizzle-orm'

interface CreateGoalCompletionRequest {
  goalId: string
}

export async function createGoalCompletion({
  goalId
}: CreateGoalCompletionRequest) {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

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
          lte(goalCompletions.createdAt, lastDayOfWeek),
          eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  const result = await db
    .with(goalsCompletionsCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql`
        COALESCE(${goalsCompletionsCounts.completionCounts}, 0)
    `.mapWith(Number)
    })
    .from(goals)
    .leftJoin(
      goalsCompletionsCounts,
      eq(goalsCompletionsCounts.goalId, goals.id)
    )
    .where(eq(goals.id, goalId))
    .limit(1)

  const { completionCount, desiredWeeklyFrequency } = result[0]

  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error('Goal already completed this week!')
  }

  const insertResult = await db
    .insert(goalCompletions)
    .values({ goalId })
    .returning()

  const goalCompletion = insertResult[0]

  return {
    goalCompletion
  }
}
