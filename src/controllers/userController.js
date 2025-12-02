import sql from "mssql";

// Lấy danh sách User (Read) - Cái này chưa có SP nên dùng query thường hoặc tạo view sau
export const getUsers = async (req, res) => {
    try {
        const result = await sql.query("SELECT * FROM [USER]");
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách: " + error.message });
    }
};

// Thêm User (Create) - Gọi sp_InsertUser
export const createUser = async (req, res) => {
    let { UserID, FirstName, LastName, Email, Phone, Password, Birthday, Gender } = req.body;

    // Clean data cơ bản
    Phone = Phone ? Phone.trim() : "";
    try {
        const request = new sql.Request();
        
        // Truyền tham số vào Stored Procedure
        request.input("UserID", sql.VarChar(10), UserID);
        request.input("FirstName", sql.NVarChar(50), FirstName);
        request.input("LastName", sql.NVarChar(50), LastName);
        request.input("Email", sql.VarChar(100), Email);
        request.input("Phone", sql.VarChar(15), Phone);
        request.input("Password", sql.VarChar(50), Password);
        request.input("Birthday", sql.Date, Birthday); // Định dạng YYYY-MM-DD
        request.input("Gender", sql.NVarChar(10), Gender);

        // Thực thi thủ tục
        await request.execute("sp_InsertUser");

        res.status(201).json({ message: "Thêm người dùng thành công!" });
    } catch (error) {
        // Lỗi từ lệnh THROW trong SQL sẽ lọt vào đây
        console.error("SQL Error:", error.message); 
        // Trả về đúng message lỗi logic (ví dụ: "Lỗi: Mật khẩu yếu...")
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật User (Update) - Gọi sp_UpdateUser
export const updateUser = async (req, res) => {
    const { id } = req.params; // Lấy UserID từ URL
    const { NewEmail, NewPhone, NewPassword } = req.body;

    try {
        const request = new sql.Request();
        request.input("UserID", sql.VarChar(10), id);
        request.input("NewEmail", sql.VarChar(100), NewEmail);
        request.input("NewPhone", sql.VarChar(15), NewPhone);
        request.input("NewPassword", sql.VarChar(50), NewPassword);

        await request.execute("sp_UpdateUser");

        res.status(200).json({ message: "Cập nhật thông tin người dùng thành công!" });
    } catch (error) {
        console.error("SQL Error:", error.message);
        res.status(400).json({ message: error.message });
    }
};

// Xóa User (Delete) - Gọi sp_DeleteUser
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const request = new sql.Request();
        request.input("UserID", sql.VarChar(10), id);

        await request.execute("sp_DeleteUser");

        res.status(200).json({ message: "Xóa người dùng thành công!" });
    } catch (error) {
        console.error("SQL Error:", error.message);
        // Ví dụ: Lỗi xóa người dùng đã có vé (Booking) sẽ được trả về tại đây
        res.status(400).json({ message: error.message });
    }
};