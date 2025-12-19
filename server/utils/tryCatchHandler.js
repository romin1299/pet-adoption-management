export default async (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next).catch((error) => {
        console.error("Error caught in TryCatchHandler:", error);
        return res.status(500).json({ message: error?.message, error });
      });
    } catch (error) {
      next(error);
    }
  };
};
