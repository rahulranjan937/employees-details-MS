import { Router } from 'express';

const router = Router();

import {
  createEmployee,
  listEmployees,
  getEmployee,
  deleteEmployee,
  updateEmployee,
} from '../controllers/employeesController.js';

router.get('/employees', listEmployees);
router.post('/employees', createEmployee);
router.get('/employees/:id', getEmployee);
router.delete('/employees/:id', deleteEmployee);
router.put('/employees/:id', updateEmployee);

export default router;
