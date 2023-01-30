import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from '@prisma/client';

// /projectのエンドポイントはUseGuardsでjwt認証を必要とする
@UseGuards(AuthGuard('jwt'))
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  getProject(@Req() req: Request): Promise<Project[]> {
    return this.projectService.getProjects(req.user.id);
  }

  @Get(':id')
  getProjectById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) projectId: number, //パラメーターと読み取って数値に変換
  ): Promise<Project> {
    return this.projectService.getProjectById(req.user.id, projectId);
  }

  @Post()
  createProject(
    @Req() req: Request,
    @Body() dto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectService.createProject(req.user.id, dto);
  }

  @Patch(':id')
  updateProjectById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) projectId: number,
    @Body() dto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.updateProjectById(req.user.id, projectId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteProjectById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) projectId: number,
  ): Promise<void> {
    return this.projectService.deleteProjectById(req.user.id, projectId);
  }
}
