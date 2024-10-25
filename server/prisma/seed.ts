import { PrismaClient } from '@prisma/client';
import { permissionData } from './seedData/permission';
import { roleData } from './seedData/role';
import { adminData } from './seedData/admin';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient()


async function main() {
  console.log("Start seeding ...");

  for (const permissionItem of permissionData) {
    const { slug, group, name, groupOrder } = permissionItem;

    await prisma.permission.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        group,
        name,
        groupOrder,
      },
    });
    console.log(`Created permission with slug: ${slug}`);
  }

  for (const roleItem of roleData) {
    const { name, slug, description, displayName, isActive } = roleItem;

    const roleExists = await prisma.role.findFirst({
      where: {
        slug,
      },
    });

    if (!roleExists) {
      const role = await prisma.role.create({
        data: {
          name,
          slug,
          description,
          isActive,
        },
      });

      if (role.slug === "superadmin") {
        const permissions = await prisma.permission.findMany({
          where: {
            NOT: {
              slug: {
                in: [],
              },
            },
          },
        });

        const permissionIds = permissions.map((permission) => permission.id);

        Promise.all(
          permissionIds.map(async (permissionId) => {
            await prisma.permissionRole.create({
              data: {
                roleId: role.id,
                permissionId: permissionId,
              },
            });
          })
        );
      }

      console.log(`Created role with slug: ${slug}`);
    } else {
      console.log(`Role with slug: ${slug} already exists`);
    }
  }
  console.log("Created roles and permissions");

  //
  for (const adminItem of adminData) {
    const { username, email, password, isActive } = adminItem;

    const hash = await bcrypt.hash(password, 15);

    const admin = await prisma.admin.upsert({
      where: { email, username },
      update: {},
      create: {
        username,
        email,
        password: hash,
        isActive,
      },
    });

    if (admin.username !== "super_admin") {
      const rolesSlug = [
        {
          slug: "admin",
        },
        {
          slug: "driver",
        },
        {
          slug: "user",
        },
      ];

      const roles = await prisma.role.findMany({
        where: {
          slug: {
            in: rolesSlug.map((role) => role.slug),
          },
        },
      });
      const roleIds = roles.map((role) => role.id);

      Promise.all(
        roleIds.map(async (roleId) => {
          await prisma.adminRole.create({
            data: {
              adminId: admin.id,
              roleId: roleId,
            },
          });
        })
      );
    } else {
      const role = await prisma.role.findFirst({
        where: {
          slug: "superadmin",
        },
      });

      await prisma.adminRole.create({
        data: {
          adminId: admin.id,
          roleId: role.id,
        },
      });
    }

    console.log(`Created admin with email: ${email}`);
  }

  // Create 20 users

  for (let i = 0; i < 100; i++) {
    const user = await prisma.admin.create({
      data: {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: await bcrypt.hash("password", 15),
        isActive: true,
      },
    });

    const rolesSlug = [
      {
        slug: "admin",
      },
      {
        slug: "driver",
      },
      {
        slug: "user",
      },
    ];

    const userRole = await prisma.role.findFirst({
      where: {
        slug: rolesSlug[Math.floor(Math.random() * rolesSlug.length)].slug,
      },
    });

    if (userRole) {
      await prisma.adminRole.create({
        data: {
          adminId: user.id,
          roleId: userRole.id,
        },
      });
    }

    // make
    console.log(
      `Created user with email: ${user.email} and role: ${userRole.slug}`
    );
  }

  console.log("Seeding finished.");
}


main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
