import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { createGoal } from '../services/create-goal'
import fastify from 'fastify'
import z from 'zod'
import { getWeekPendingGoals } from '../services/get-week-pending-goals'
import { createGoalCompletion } from '../services/create-goal-completion'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.get('/pending-goals', async () => {
  const { pendingGoals } = await getWeekPendingGoals()

  return { pendingGoals }
})

app.post(
  '/goals',
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number()
      })
    }
  },
  async (request) => {
    const { title, desiredWeeklyFrequency } = request.body

    await createGoal({ title, desiredWeeklyFrequency })
  }
)

app.post(
  '/completions',
  {
    schema: {
      body: z.object({
        goalId: z.string()
      })
    }
  },
  async (request) => {
    const { goalId } = request.body

    await createGoalCompletion({
      goalId
    })
  }
)

app
  .listen({
    port: process.env.PORT ? Number(process.env.PORT) : 3333
  })
  .then(() => {
    console.log('Server running!')
  })
