#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/e1ad73542f65910d59e33f31c0d017c0aa28cdb14dc93c2c94cdb4ad6a3dab5a/contract';
import endContract from '../../snapshots/e1ad73542f65910d59e33f31c0d017c0aa28cdb14dc93c2c94cdb4ad6a3dab5a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'marketData',
        columns: [
          col('close', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('date', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('high', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('low', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('open', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'researchExperiment',
        columns: [
          col('condition', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('costAssumptions', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('entry', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('exit', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('holdingPeriod', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('hypothesis', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('market', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('researchQuestion', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('testPeriod', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'marketData',
        index: 'marketData_date_idx_b4ca319c',
        columns: ['date'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
