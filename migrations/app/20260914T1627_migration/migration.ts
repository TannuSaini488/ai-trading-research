#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/be23e37491f308e8e441ee303bb1961476278f04d0b0340efd5acde4626a0313/contract';
import endContract from '../../snapshots/be23e37491f308e8e441ee303bb1961476278f04d0b0340efd5acde4626a0313/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/e1ad73542f65910d59e33f31c0d017c0aa28cdb14dc93c2c94cdb4ad6a3dab5a/contract';
import startContract from '../../snapshots/e1ad73542f65910d59e33f31c0d017c0aa28cdb14dc93c2c94cdb4ad6a3dab5a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropIndex({
        schema: 'public',
        table: 'marketData',
        index: 'marketData_date_idx_b4ca319c',
      }),
      this.dropDefault({ schema: 'public', table: 'researchExperiment', column: 'createdAt' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
