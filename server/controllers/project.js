import * as ProjectModel from '../models/project.js';
import * as UserModel from '../models/user.js';
import AppError from '../utils/appError.js';

export const createProject = async (req, res, next) => {
  try {
    const userId = res.locals.userId;
    const { framework, name } = req.body;
    const project = await ProjectModel.createProject(framework, userId, name);

    res.status(200).json({
      data: project,
    });
  } catch (err) {
    if (err instanceof Error) {
      return next(new AppError(err.message, 400));
    }
    next(err);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const { userId } = res.locals;
    const projects = await ProjectModel.getProjectsByMembers(userId);

    res.status(200).json({
      data: projects,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const { projectId, bin, interval } = req.query;
    const project = await ProjectModel.getProject(projectId);
    if (!project) return next(new AppError('project not found'));

    if (!bin || !interval) {
      res.status(200).json({
        data: {
          project,
        },
      });
      return;
    }
    const eventsNumPerTime = await ProjectModel.getErrorsPerHoursByProjectId(
      projectId,
      bin,
      interval,
    );

    res.status(200).json({
      data: {
        project,
        eventsNumPerTime,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getProjectMembers = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { members } = await ProjectModel.getProject(id);

    const userPromises = [];
    members.forEach(el => userPromises.push(UserModel.findUserById(+el)));
    const users = await Promise.all(userPromises);

    const trimUsers = users.map(el => {
      const user = Object.assign(el);
      delete user.password;
      delete user.user_key;
      return user;
    });

    res.status(200).json({
      data: trimUsers,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateProjectMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, action } = req.body;
    const member = await UserModel.findUserByEmail(email);
    if (!member) return next(new AppError('user not found', 404));
    const project = await ProjectModel.checkMemberByProjectId(member.id, id);

    if (action === 'add' && project)
      return next(new AppError('the user already participate in the project', 400));
    if (action === 'remove' && !project)
      return next(new AppError("the user doesn't a member of the project", 400));
    if (action === 'remove' && +project.user_id === member.id)
      return next(new AppError("the user created the project can't be removed", 400));

    const result = await ProjectModel.updateProjectMember(member.id, projectId, action);
    res.status(200).json({
      status: 'successfully',
      data: result,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.body;
    const result = await ProjectModel.deleteProject(projectId);

    if (result.rowCount === 0) return next(new AppError('The project not existed', 400));

    res.status(200).json({
      status: 'successfully',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
