import { prisma } from "./prisma";

async function testConnection() {
  try {
    // Try to create a test user
    const user = await prisma.user.create({
      data: {
        clerkId: "test-" + Date.now(),
        fullname: "Test User",
        type: "test",
      },
    });
    console.log("Test user created successfully:", user);

    // Delete the test user
    await prisma.user.delete({
      where: { id: user.id },
    });
    console.log("Test user deleted successfully");
  } catch (error) {
    console.error("Database test failed:", error);
  }
}

testConnection();
