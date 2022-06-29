
import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../utils/trpc/trpc';


// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext: async () => null,
});