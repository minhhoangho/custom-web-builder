import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { DrawDBDefinitionRepository } from '@app/drawdb/drawdb.repository';

@Injectable()
export class DrawDBMigrationService {
  migrationName = 'SyncDrawDBSchema';

  constructor(
    private readonly drawDBDefinitionRepository: DrawDBDefinitionRepository,
  ) {}

  async startMigrate(id) {
    const dbDefinition =
      await this.drawDBDefinitionRepository.findOneByIdOrFail(id);
    // Find all file in folder src/database/migrations that contain migrationName
    // If not found, create new file with migrationName
  }

  async isMigrationExist() {
    const migrationFolder = path.join(__dirname, '../../database/migrations');
    const migrationFiles = fs.readdirSync(migrationFolder);
    const migrationFileName = `${this.migrationName}.ts`;

    for (const file of migrationFiles) {
      if (file.includes(migrationFileName)) {
        return true;
      }
    }
    return false;
  }

  async createMigrationFile() {
    // Create new migration
  }

  async runRollbackForMigration() {
    // Run rollback for migration
  }

  async generateTypeormDefinitionForTable(table: string) {
    // Find all file in folder src/database/migrations that contain migrationName
    // If not found, create new file with migrationName
    // Append new migration to file
  }

  async generateMigrationFileContent() {
    // Generate migration file content
  }
}
