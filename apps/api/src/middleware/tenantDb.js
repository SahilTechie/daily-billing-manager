import mongoose from "mongoose";
import { getCustomerModel } from "../models/Customer.js";
import { getBillModel } from "../models/Bill.js";
import { getPaymentModel } from "../models/Payment.js";

const toTenantDbName = (userId) => {
  const safeUserId = String(userId || "").replace(/[^a-zA-Z0-9_-]/g, "");
  if (!safeUserId) {
    throw new Error("Missing user id for tenant resolution");
  }
  return `bill_tenant_${safeUserId}`;
};

export const tenantDb = (req, res, next) => {
  try {
    const userId = req.user?.id;
    const tenantDbName = toTenantDbName(userId);
    const connection = mongoose.connection.useDb(tenantDbName, { useCache: true });

    req.tenantDbName = tenantDbName;
    req.tenantModels = {
      Customer: getCustomerModel(connection),
      Bill: getBillModel(connection),
      Payment: getPaymentModel(connection),
    };

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to resolve tenant database",
      error: error.message,
    });
  }
};
