import sql from "mssql";

function parseRevenueDetail(row) {
    const { id, revenueDetail } = row;
    
    if (!revenueDetail || typeof revenueDetail !== "string") {
        return {
        id,
        title: null,
        totalRevenue: 0
        };
    }

    const titleMatch = revenueDetail.match(/Phim:\s*(.+)/);
    const title = titleMatch ? titleMatch[1].trim() : null;

    const revenueMatch = revenueDetail.match(/Tổng doanh thu:\s*([\d,.]+)\s*VND/);
    let totalRevenue = 0;

    if (revenueMatch) {
        totalRevenue = Number(
        revenueMatch[1].replace(/\./g, "").replace(/,/g, "")
        );
    }

    return {
        id,
        title,
        totalRevenue
    };
}


const RevenueController = {
    revenueDetail: async (req, res) => {
        try {
            const movieId = req.params.id;
            const request = new sql.Request();
            const result = await request.input("MovieID", sql.VarChar(10), movieId).query(`SELECT dbo.fn_GetMovieRevenue(@MovieID) AS Revenue`);
            res.status(200).json({ detail: result.recordset[0].Revenue });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },

    movies: async (req, res) => {
        try {
            const request = new sql.Request();
            const result = await request.query(`SELECT 
                M.Movie_ID AS id,
                dbo.fn_GetMovieRevenue(M.Movie_ID) AS revenueDetail
            FROM MOVIE M
            ORDER BY M.Movie_ID;
            `)
            res.status(200).json({ data: result.recordset.map(parseRevenueDetail) });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },
};

export default RevenueController;