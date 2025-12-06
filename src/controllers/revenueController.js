import sql from "mssql";

const RevenueController = {
    revenueDetail: async (req, res) => {
        try {
            const movieId = req.params.id;
            const request = new sql.Request();
            const result = await request.input("MovieID", sql.VarChar(10), movieId).query(`SELECT dbo.fn_GetMovieRevenue(@MovieID) AS Revenue`);
            res.status(200).json({ data: result.recordset[0].Revenue });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },

    movies: async (req, res) => {
        try {
            const request = new sql.Request();

            const result = await request.query(`
                SELECT 
                    M.Movie_ID AS id,
                    M.Title    AS title,
                    ISNULL(SUM(B.TotalPrice), 0) AS totalRevenue
                FROM MOVIE M
                LEFT JOIN SHOWTIME S 
                    ON M.Movie_ID = S.Movie_ID
                LEFT JOIN INCLUDE_SEAT I 
                    ON S.Showtime_ID = I.Showtime_ID
                LEFT JOIN BOOKING B 
                    ON I.Booking_ID = B.Booking_ID
                GROUP BY M.Movie_ID, M.Title
                ORDER BY totalRevenue DESC
            `);

            res.status(200).json({ data: result.recordset });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },
};

export default RevenueController;