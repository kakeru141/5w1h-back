import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  getProjects(userId: number): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  getProjectById(userId: number, projectId: number): Promise<Project> {
    return this.prisma.project.findFirst({
      where: {
        userId,
        id: projectId,
      },
    });
  }
  async createProject(userId: number, dto: CreateProjectDto): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        userId,
        ...dto,
      },
    });
    return project;
  }

  async updateProjectById(
    userId: number,
    projectId: number,
    dto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project || project.userId !== userId) {
      throw new ForbiddenException('No permision to update');
    }
    return this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...dto,
      },
    });
  }
  async deleteProjectById(userId: number, projectId: number): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project || project.userId !== userId) {
      throw new ForbiddenException('No permision to delete');
    }
    await this.prisma.project.delete({
      where: {
        id: projectId,
      },
    });
  }
}
