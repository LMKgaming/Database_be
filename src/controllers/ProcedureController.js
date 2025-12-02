import sql from "mssql";

const ProcedureController = {
    countBooking: async (req, res) => {
        try {
            const { q: keyword = null, max: limit = null } = req.query;
            const request = new sql.Request();
            request.input("Keyword", sql.NVarChar, keyword);
            request.input("MaxBookingCount", sql.Int, limit ? +limit : null);
            const data = await request.execute("sp_SearchUsersByBookingCount");
            res.status(200).json({ message: "Query success", data: data.recordset });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },
};

export default ProcedureController;
