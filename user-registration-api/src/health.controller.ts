import { Controller, Get } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Controller("health")
export class HealthController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Get("db")
  async db() {
    try {
      const result = await this.dataSource.query("SELECT 1 AS ok");
      return {
        status: "ok",
        db: result?.[0]?.ok === 1 ? "connected" : "unknown",
        timestamp: new Date().toISOString(),
      };
    } catch (e: any) {
      return {
        status: "error",
        db: "disconnected",
        message: e?.message || String(e),
        timestamp: new Date().toISOString(),
      };
    }
  }
}
