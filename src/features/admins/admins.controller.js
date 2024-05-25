import httpStatus from "http-status-codes";
import { matchedData, validationResult } from "express-validator";
import adminService from "./admins.service.js";
import { exceptionHandler } from "../../handlers/exception.js";

const findAllAdmin = async (req, res) => {
  let admins = await exceptionHandler(adminService.findAll)();
  if (admins.isError) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  }
  return res.status(httpStatus.OK).json({ data: admins });
};

const findAdminByCode = async (req, res) => {
  const { data } = matchedData(req);
  const admin = await exceptionHandler(adminService.findByPersonalCode)(
    data.adminCode
  );
  if (admin.isError) {
    switch (admin.message) {
      case "No Admin found":
        return res.status(httpStatus.BAD_REQUEST).json({
          message: `not found admin with personal code: ${data.adminCode}`,
        });
      default:
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
  return res.status(httpStatus.OK).json({ data: admin });
};

const createAdmin = async (req, res) => {
  const { name, password, role } = req.body;
  const admin = await adminService.create(name, password, role);
  if (!admin) return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  return res.status(201).json({ data: admin });
};

const deactivateAdmin = async (req, res) => {
  const { data } = matchedData(req);
  const admin = await exceptionHandler(adminService.deactivate)(data.adminCode);
  if (admin.isError) {
    console.error("admin error ", admin.name);
    switch (admin.name) {
      case "PrismaClientKnownRequestError":
      case "PrismaClientValidationError":
        return res.status(httpStatus.BAD_REQUEST).json({
          message: `Admin not found with personal code ${data.adminCode}`,
        });
      default:
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
  return res.status(200).end();
};

const adminActions = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { process } = matchedData(req);
    switch (process) {
      case "deactivate":
        return deactivateAdmin(req, res);
      case "search":
        return findAdminByCode(req, res);
      default:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Invalid action name" });
    }
  }
  return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });
};

const transfer = async (req, res) => {
  const { adminId, data } = matchedData(req);

  const transaction = await exceptionHandler(adminService.transfer)({
    ...data,
    adminId,
  });

  if (transaction.isError) {
    switch (transaction.name) {
      case "UserNotExistError":
      case "InsufficientBalanceError":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: transaction.message });
      default:
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
  return res.status(httpStatus.OK).end();
};

const listTransactionsByUserEmail = async (req, res) => {
  const { data } = matchedData(req);
  const transactions = await exceptionHandler(
    adminService.getTransactionsByEmail
  )(data.userEmail);

  if (transactions.isError) {
    switch (transactions.name) {
      case "NotFoundError":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: `User not found with email ${data.userEmail}` });
      default:
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
  return res.status(httpStatus.OK).json({ data: transactions });
};

const withdrawOrDeposit = async (req, res) => {
  const { process, adminId, data } = matchedData(req);
  let user;
  switch (process) {
    case "withdraw":
      user = await exceptionHandler(adminService.withdraw)(
        data.userEmail,
        data.amount,
        adminId
      );
      break;
    case "deposit":
      user = await exceptionHandler(adminService.deposit)(
        data.userEmail,
        data.amount,
        adminId
      );
      break;
  }

  if (user.isError) {
    switch (user.name) {
      case "PrismaClientValidationError":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: `User not found with email ${data.userEmail}` });
      case "PrismaClientKnownRequestError":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: `Admin not found with id ${adminId}` });
      case "WithdrawError":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: user.message });

      default:
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }

  return res.status(httpStatus.OK).end();
};

const transactions = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });
  }
  const { process } = matchedData(req);
  switch (process) {
    case "transfer":
      return transfer(req, res);
    case "withdraw":
    case "deposit":
      return withdrawOrDeposit(req, res);
    case "list":
      return listTransactionsByUserEmail(req, res);
    default:
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Invalid transfer type name" });
  }
};

const userRegistration = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });
  const data = matchedData(req);
  const user = await exceptionHandler(adminService.userCreation)(data);
  if (user.isError) {
    switch (user.name) {
      case "UserCreatedError":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: user.message });
    }
  }
  return res.status(httpStatus.CREATED).json({ data: user });
};

export default {
  findAllAdmin,
  createAdmin,
  adminActions,
  transactions,
  userRegistration,
};
