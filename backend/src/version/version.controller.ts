import { Controller, Get } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

type AppVersion = {
    version: string;
    commit: string;
    build?: string;
};

@Controller('version')
export class VersionController {
    @Get()
    getVersion(): AppVersion {
        const file = join(process.cwd(), 'version.json');
        if (!existsSync(file)) {
            return { version: 'dev', commit: 'local' };
        }
        return JSON.parse(readFileSync(file, 'utf8')) as AppVersion;
    }
}
