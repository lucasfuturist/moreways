# main.tf (Conceptual)

# 1. Database (RDS Aurora Serverless v2) -> High Availability
resource "aws_rds_cluster" "default" {
  cluster_identifier = "attribution-db"
  engine            = "aurora-postgresql"
  availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]
  database_name     = "attribution_engine"
  master_username   = "admin"
  master_password   = var.db_password
}

# 2. Redis (ElastiCache) -> Multi-AZ
resource "aws_elasticache_replication_group" "default" {
  replication_group_id          = "attribution-queue"
  replication_group_description = "Redis for BullMQ"
  node_type                     = "cache.t3.medium"
  automatic_failover_enabled    = true
  multi_az_enabled              = true
}

# 3. ECS Fargate (Compute) -> Auto-Scaling
resource "aws_ecs_service" "api" {
  name            = "attribution-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 2 # Start with 2, scale to 100
  
  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = 3000
  }
}