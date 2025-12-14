import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { logger } from '../infra/logger/infra.logger';
import { SearchController } from './handler/api.handler.searchRoute';
import { NodeController } from './handler/api.handler.nodeRoute';
// [NEW] Import Validate Controller
import { ValidateController } from './handler/api.handler.validateRoute';
import { ContextAssembler } from '../retrieve/svc/retrieve.svc.contextAssembler';
import { SupabaseGraphReader } from '../infra/supabase/infra.supabase.reader';
import { SupabaseOverrideRepo } from '../graph/repo/graph.repo.overrideRepo';
import { z } from 'zod';

export function createApp() {
    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(pinoHttp({ logger }));

    const graphReader = new SupabaseGraphReader();
    const overrideRepo = new SupabaseOverrideRepo();
    const assembler = new ContextAssembler(graphReader, overrideRepo);
    
    const searchController = new SearchController(assembler);
    const nodeController = new NodeController(graphReader);
    // [NEW] Instantiate Controller
    const validateController = new ValidateController();

    // Routes
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok', uptime: process.uptime() });
    });

    app.post('/api/v1/search', async (req, res, next) => searchController.handleSearch(req.body).then(d => res.json(d)).catch(next));
    app.get('/api/v1/node/:id', nodeController.handleGetNode);
    
    // [FIX] Match existing endpoint styles (must be /api/v1/validate)
    app.post('/api/v1/validate', validateController.handleValidation);

    // Error Handling
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof z.ZodError) {
             res.status(400).json({ error: "Validation Failed", details: err.errors });
             return; 
        }
        logger.error(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    });

    return app;
}

export const app = createApp();

if (require.main === module) {
    const PORT = process.env.PORT || 3004;
    app.listen(PORT, () => {
        logger.info(`🚀 Server listening on port ${PORT}`);
    });
}