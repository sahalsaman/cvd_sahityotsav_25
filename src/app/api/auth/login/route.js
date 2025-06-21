// app/api/login/route.js
export async function POST(request) {
  const { username, password } = await request.json();

  // Hardcoded users
  const USERS = [
    {
      _id: "zaman822App_01",
      name: "Sahal",
      username: "sahalsaman",
      password: "zaman8547",
      role : "superAdmin"
    },
    {
      _id: "zaman822App_02",
      name: "Cheruvadi",
      username: "cvd",
      password: "710",
    },
    {
      _id: "zaman822App_03",
      name: "KC",
      username: "konnalath",
      password: "pass123",
    },
  ];

  // Find matching user
  const matchedUser = USERS.find(
    (user) => user.username === username && user.password === password
  );

  if (matchedUser) {
    // Don't return password in the response
    const { password, ...safeUser } = matchedUser;
    return Response.json(
      { success: true, message: "Login successful", user: safeUser },
      { status: 200 }
    );
  }

  return Response.json(
    { success: false, message: "Invalid credentials" },
    { status: 401 }
  );
}
