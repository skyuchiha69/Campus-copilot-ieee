import { Response, NextFunction } from 'express';
import { RequestWithId } from '../middleware/requestId';
import Notice from '../models/Notice';
import UniversityEvent from '../models/UniversityEvent';
import CampusLocation from '../models/CampusLocation';
import PublicCourse from '../models/PublicCourse';
import mongoose from 'mongoose';

export const getNotices = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: [], error: null, requestId: req.id });
    }

    const { category, priority } = req.query;
    const filter: any = {};
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const notices = await Notice.find(filter).sort({ published_at: -1 });

    return res.json({
      success: true,
      data: notices,
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: [], error: null, requestId: req.id });
    }

    const { category } = req.query;
    const filter: any = {};
    if (category) filter.category = category;

    const events = await UniversityEvent.find(filter).sort({ date: 1 });

    return res.json({
      success: true,
      data: events,
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const getCampusLocations = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: [], error: null, requestId: req.id });
    }

    const { category, building } = req.query;
    const filter: any = {};
    if (category) filter.category = category;
    if (building) filter.building = building;

    const locations = await CampusLocation.find(filter).sort({ building: 1, name: 1 });

    return res.json({
      success: true,
      data: locations,
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicCourses = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: [], error: null, requestId: req.id });
    }

    const { department, semester } = req.query;
    const filter: any = {};
    if (department) filter.department = department;
    if (semester) filter.semester = semester;

    const courses = await PublicCourse.find(filter).sort({ course_code: 1 });

    return res.json({
      success: true,
      data: courses,
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};
