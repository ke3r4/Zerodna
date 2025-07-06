import { db } from "./db";
import { settings, pages, users, roles, permissions, userRoles, rolePermissions } from "@shared/schema";
import { eq } from "drizzle-orm";

const defaultSettings = [
  {
    key: 'siteName',
    value: 'ZeroDNA',
    type: 'text',
    label: 'Site Name',
    description: 'The name of your website'
  },
  {
    key: 'siteDescription',
    value: 'ZeroDNA specializes in AI solutions for healthtech, automation, and manufacturing industries. Redefining the future through intelligent technology.',
    type: 'text',
    label: 'Site Description',
    description: 'Brief description of your website'
  },
  {
    key: 'logoUrl',
    value: '',
    type: 'image',
    label: 'Logo URL',
    description: 'URL to your website logo'
  },
  {
    key: 'faviconUrl',
    value: '',
    type: 'image',
    label: 'Favicon URL',
    description: 'URL to your website favicon'
  },
  {
    key: 'primaryColor',
    value: '#1E3AE2',
    type: 'text',
    label: 'Primary Color',
    description: 'Primary brand color'
  },
  {
    key: 'contactEmail',
    value: 'zerodna@gmail.com',
    type: 'text',
    label: 'Contact Email',
    description: 'Main contact email address'
  },
  {
    key: 'contactPhone',
    value: '+49 15560 734148',
    type: 'text',
    label: 'Contact Phone',
    description: 'Main contact phone number'
  },
  {
    key: 'socialLinks',
    value: JSON.stringify({
      linkedin: '',
      twitter: '',
      github: ''
    }),
    type: 'json',
    label: 'Social Links',
    description: 'Social media profile links'
  },
  {
    key: 'seoSettings',
    value: JSON.stringify({
      metaTitle: 'ZeroDNA - AI Solutions for the Future',
      metaDescription: 'ZeroDNA specializes in AI solutions for healthtech, automation, and manufacturing industries. Redefining the future through intelligent technology.',
      ogImage: '',
      analytics: ''
    }),
    type: 'json',
    label: 'SEO Settings',
    description: 'Search engine optimization settings'
  },
  {
    key: 'maintenanceMode',
    value: 'false',
    type: 'boolean',
    label: 'Maintenance Mode',
    description: 'Enable maintenance mode'
  },
  {
    key: 'logoSize',
    value: 'md',
    type: 'text',
    label: 'Logo Size',
    description: 'Size of the logo across the website'
  }
];

export async function seedPages() {
  console.log('Seeding default pages...');
  
  try {
    // Check if pages already exist
    const existingPages = await db.select().from(pages);
    
    if (existingPages.length === 0) {
      await db.insert(pages).values([
        {
          title: "Home",
          slug: "home",
          content: JSON.stringify({
            hero: {
              title: "We build the future from antiquity",
              subtitle: "Advanced AI solutions for healthcare, automation, and manufacturing industries",
              description: "ZeroDNA delivers cutting-edge artificial intelligence solutions that transform traditional industries. Our expertise spans healthcare innovation, industrial automation, and smart manufacturing systems."
            },
            features: [
              {
                title: "Healthcare AI",
                description: "Revolutionary diagnostic and treatment optimization systems",
                icon: "heart"
              },
              {
                title: "Industrial Automation", 
                description: "Smart manufacturing and process optimization solutions",
                icon: "settings"
              },
              {
                title: "Data Intelligence",
                description: "Advanced analytics and predictive modeling platforms",
                icon: "brain"
              }
            ]
          }),
          status: "published",
          metaDescription: "ZeroDNA - Advanced AI solutions for healthcare, automation, and manufacturing industries"
        },
        {
          title: "About",
          slug: "about",
          content: JSON.stringify({
            hero: {
              title: "About ZeroDNA",
              subtitle: "Pioneering the future of AI-driven solutions"
            },
            sections: [
              {
                title: "Our Mission",
                content: "At ZeroDNA, we believe in harnessing the power of artificial intelligence to solve complex challenges across healthcare, automation, and manufacturing. Our mission is to bridge the gap between cutting-edge technology and practical applications."
              },
              {
                title: "Our Approach", 
                content: "We combine deep industry expertise with advanced AI technologies to deliver solutions that are not only innovative but also practical and scalable. Our team of experts works closely with clients to understand their unique challenges and develop tailored solutions."
              },
              {
                title: "Why Choose ZeroDNA",
                content: "With years of experience in AI development and implementation, we bring proven expertise to every project. Our solutions are designed to be robust, scalable, and seamlessly integrated into existing workflows."
              }
            ]
          }),
          status: "published",
          metaDescription: "Learn about ZeroDNA's mission to revolutionize industries through advanced AI solutions"
        },
        {
          title: "Services",
          slug: "services",
          content: JSON.stringify({
            hero: {
              title: "Our Services",
              subtitle: "Comprehensive AI solutions tailored to your industry needs"
            },
            services: [
              {
                title: "AI Healthcare Solutions",
                description: "Advanced diagnostic systems, treatment optimization, and patient care automation",
                features: [
                  "Medical imaging analysis",
                  "Treatment recommendation systems", 
                  "Patient monitoring automation",
                  "Clinical decision support"
                ]
              },
              {
                title: "Industrial Automation",
                description: "Smart manufacturing, process optimization, and predictive maintenance solutions",
                features: [
                  "Production line optimization",
                  "Quality control automation",
                  "Predictive maintenance",
                  "Supply chain management"
                ]
              },
              {
                title: "Data Intelligence Platform",
                description: "Advanced analytics, machine learning, and business intelligence solutions",
                features: [
                  "Real-time data processing",
                  "Predictive analytics",
                  "Business intelligence dashboards",
                  "Custom ML model development"
                ]
              }
            ]
          }),
          status: "published",
          metaDescription: "Explore ZeroDNA's comprehensive AI services for healthcare, automation, and manufacturing"
        },
        {
          title: "Contact",
          slug: "contact",
          content: JSON.stringify({
            hero: {
              title: "Contact Us",
              subtitle: "Ready to transform your business with AI? Let's discuss your project."
            },
            contactInfo: {
              email: "info@zerodna.com",
              phone: "+1 (555) 123-4567",
              address: "123 Innovation Drive, Tech City, TC 12345"
            },
            formFields: [
              {
                name: "name",
                label: "Full Name",
                type: "text",
                required: true
              },
              {
                name: "email",
                label: "Email Address",
                type: "email", 
                required: true
              },
              {
                name: "company",
                label: "Company",
                type: "text",
                required: false
              },
              {
                name: "industry",
                label: "Industry",
                type: "select",
                options: ["Healthcare", "Manufacturing", "Automation", "Other"],
                required: true
              },
              {
                name: "message",
                label: "Message",
                type: "textarea",
                required: true
              }
            ]
          }),
          status: "published",
          metaDescription: "Contact ZeroDNA for AI solutions in healthcare, automation, and manufacturing"
        }
      ]);
      
      console.log('✅ Pages seeded successfully');
    } else {
      console.log('📄 Pages already exist, skipping seed');
    }
  } catch (error) {
    console.error('❌ Error seeding pages:', error);
  }
}

export async function seedSettings() {
  console.log('Seeding default settings...');
  
  for (const setting of defaultSettings) {
    try {
      // Check if setting already exists
      const existing = await db.select().from(settings).where(eq(settings.key, setting.key));
      
      if (existing.length === 0) {
        await db.insert(settings).values({
          ...setting,
          updatedAt: new Date()
        });
        console.log(`Created setting: ${setting.key}`);
      } else {
        console.log(`Setting already exists: ${setting.key}`);
      }
    } catch (error) {
      console.error(`Error seeding setting ${setting.key}:`, error);
    }
  }
  
  console.log('Settings seeding completed');
}

export async function seedAdmin() {
  console.log('Seeding admin user and roles...');
  
  try {
    // Create Super Admin role if it doesn't exist
    const existingRole = await db.select().from(roles).where(eq(roles.name, 'super_admin'));
    let superAdminRole;
    
    if (existingRole.length === 0) {
      [superAdminRole] = await db.insert(roles).values({
        name: 'super_admin',
        displayName: 'Super Admin',
        description: 'Full system access with all permissions',
        level: 10,
        isActive: true
      }).returning();
      console.log('Created Super Admin role');
    } else {
      superAdminRole = existingRole[0];
    }

    // Create admin user if it doesn't exist
    const existingUser = await db.select().from(users).where(eq(users.username, 'admin'));
    let adminUser;
    
    if (existingUser.length === 0) {
      [adminUser] = await db.insert(users).values({
        username: 'admin',
        email: 'admin@zerodna.com',
        password: 'admin123', // In production, this should be hashed
        firstName: 'System',
        lastName: 'Administrator',
        isActive: true
      }).returning();
      console.log('Created admin user');
    } else {
      adminUser = existingUser[0];
    }

    // Assign Super Admin role to admin user
    const existingUserRole = await db.select().from(userRoles)
      .where(eq(userRoles.userId, adminUser.id));
    
    if (existingUserRole.length === 0) {
      await db.insert(userRoles).values({
        userId: adminUser.id,
        roleId: superAdminRole.id,
        assignedBy: adminUser.id
      });
      console.log('Assigned Super Admin role to admin user');
    }

    console.log('Admin seeded successfully!');
    console.log('Login credentials: admin / admin123');
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
}

// Run seeds if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  Promise.all([seedSettings(), seedPages(), seedAdmin()])
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}