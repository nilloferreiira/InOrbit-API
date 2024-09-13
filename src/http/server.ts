import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'
import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { createGoalRoute } from './create-goal'
import { createComletionRoute } from './create-completion'
import { getPendingGoalsRoute } from './get-pending-goals'
import { getWeekSummaryRoute } from './get-week-summary'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*'
})

app.register(createGoalRoute)
app.register(createComletionRoute)
app.register(getPendingGoalsRoute)
app.register(getWeekSummaryRoute)

app
  .listen({
    port: process.env.PORT ? Number(process.env.PORT) : 3333
  })
  .then(() => {
    console.log('Server running!')
  })
