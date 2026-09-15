// lib/jobPostService.ts
import { connectDB } from "@/app/(backend)/lib/mongodb";
import JobPost from "@/app/(backend)/models/JobPost";
import { generateSlug, generateUniqueSlug } from "./generateSlug";
import { JobPostFormData } from "@/app/(frontend_pages)/lib/jobPostTypes";
import { ValidationError } from "@/app/(frontend_pages)/lib/validateJobPost";

export class JobPostService {
  /**
   * Create a new job post
   */
  async createJobPost(
    data: JobPostFormData,
    userId: string,
  ): Promise<{ success: boolean; data?: any; errors?: ValidationError[] }> {
    try {
      await connectDB();

      // Generate slug
      const baseSlug = generateSlug(data.title);

      // Check for existing slugs
      const existingSlugs = await JobPost.find({
        slug: { $regex: `^${baseSlug}` },
      }).select("slug");

      const slugList = existingSlugs.map((doc) => doc.slug);
      const slug = await generateUniqueSlug(data.title, slugList);

      // Prepare locations with IDs
      const locations = data.locations.map((loc) => ({
        streetAddress: loc.streetAddress,
        city: loc.city,
        region: loc.region,
        postalCode: loc.postalCode,
        country: loc.country,
      }));

      // Create job post
      const jobPost = await JobPost.create({
        title: data.title,
        contentJson: data.contentJson,
        companyName: data.companyName,
        companyLogoUrl: data.companyLogoUrl,
        companyUrl: data.companyUrl,
        jobLocationType: data.jobLocationType,
        locations,
        applicantLocationRequirement: data.applicantLocationRequirement,
        employmentType: data.employmentType,
        experienceLevel: data.experienceLevel,
        skills: data.skills || [],
        salary: {
          type: data.salary.type,
          currency: data.salary.currency || "USD",
          unit: data.salary.unit || "YEAR",
          amount: data.salary.amount,
          minAmount: data.salary.minAmount,
          maxAmount: data.salary.maxAmount,
        },
        datePosted: data.datePosted,
        validThrough: data.validThrough,
        applyUrl: data.applyUrl,
        aboutCompany: data.aboutCompany,
        metaDescription: data.metaDescription,
        slug,
        status: "published",
        userId,
      });

      return {
        success: true,
        data: jobPost,
      };
    } catch (error: any) {
      console.error("Create job post error:", error);
      return {
        success: false,
        errors: [{ field: "general", message: error.message }],
      };
    }
  }

  /**
   * Get job post by ID
   */
  async getJobPostById(id: string, userId?: string) {
    try {
      await connectDB();

      const query: any = { _id: id, isActive: true };
      if (userId) {
        query.userId = userId;
      }

      const jobPost = await JobPost.findOne(query);

      if (!jobPost) {
        return {
          success: false,
          errors: [{ field: "general", message: "Job post not found" }],
        };
      }

      return {
        success: true,
        data: jobPost,
      };
    } catch (error: any) {
      return {
        success: false,
        errors: [{ field: "general", message: error.message }],
      };
    }
  }

  /**
   * Get job post by slug
   */
  async getJobPostBySlug(slug: string) {
    try {
      await connectDB();

      const jobPost = await JobPost.findOne({
        slug,
        status: "published",
        isActive: true,
      });

      if (!jobPost) {
        return {
          success: false,
          errors: [{ field: "general", message: "Job post not found" }],
        };
      }

      // Increment view count
      // await JobPost.findByIdAndUpdate(jobPost._id, { $inc: { views: 1 } });

      return {
        success: true,
        data: jobPost,
      };
    } catch (error: any) {
      return {
        success: false,
        errors: [{ field: "general", message: error.message }],
      };
    }
  }

  /**
   * Get all job posts with pagination and filters
   */
  async getJobPosts(options: {
    page?: number;
    limit?: number;
    status?: string;
    employmentType?: string;
    experienceLevel?: string;
    jobLocationType?: string;
    city?: string;
    country?: string;
    search?: string;
    userId?: string;
  }) {
    try {
      await connectDB();

      const {
        page = 1,
        limit = 20,
        status = "published",
        employmentType,
        experienceLevel,
        jobLocationType,
        city,
        country,
        search,
        userId,
      } = options;

      const query: any = { isActive: true };

      if (status) {
        query.status = status;
      }

      if (userId) {
        query.userId = userId;
      }

      if (employmentType) {
        query.employmentType = employmentType;
      }

      if (experienceLevel) {
        query.experienceLevel = experienceLevel;
      }

      if (jobLocationType) {
        query.jobLocationType = jobLocationType;
      }

      if (city) {
        query["locations.city"] = { $regex: new RegExp(city, "i") };
      }

      if (country) {
        query["locations.country"] = { $regex: new RegExp(country, "i") };
      }

      if (search) {
        query.$or = [
          { title: { $regex: new RegExp(search, "i") } },
          { companyName: { $regex: new RegExp(search, "i") } },
          { skills: { $in: [new RegExp(search, "i")] } },
        ];
      }

      const skip = (page - 1) * limit;

      const [jobPosts, total] = await Promise.all([
        JobPost.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select("-contentJson -__v")
          .lean(),
        JobPost.countDocuments(query),
      ]);

      return {
        success: true,
        data: jobPosts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        errors: [{ field: "general", message: error.message }],
      };
    }
  }

  /**
   * Update job post
   */
  async updateJobPost(
    id: string,
    data: Partial<JobPostFormData>,
    userId: string,
  ) {
    try {
      await connectDB();

      const jobPost = await JobPost.findOne({ _id: id, userId });

      if (!jobPost) {
        return {
          success: false,
          errors: [{ field: "general", message: "Job post not found" }],
        };
      }

      // Update fields
      const updateData: any = {};

      if (data.title) {
        updateData.title = data.title;
        // Update slug if title changed
        const baseSlug = generateSlug(data.title);
        const existingSlugs = await JobPost.find({
          slug: { $regex: `^${baseSlug}` },
          _id: { $ne: id },
        }).select("slug");

        const slugList = existingSlugs.map((doc) => doc.slug);
        updateData.slug = await generateUniqueSlug(data.title, slugList);
      }

      if (data.contentJson !== undefined)
        updateData.contentJson = data.contentJson;
      if (data.companyName !== undefined)
        updateData.companyName = data.companyName;
      if (data.companyLogoUrl !== undefined)
        updateData.companyLogoUrl = data.companyLogoUrl;
      if (data.companyUrl !== undefined)
        updateData.companyUrl = data.companyUrl;
      if (data.jobLocationType !== undefined)
        updateData.jobLocationType = data.jobLocationType;

      if (data.locations !== undefined) {
        updateData.locations = data.locations.map((loc) => ({
          streetAddress: loc.streetAddress,
          city: loc.city,
          region: loc.region,
          postalCode: loc.postalCode,
          country: loc.country,
        }));
      }

      if (data.applicantLocationRequirement !== undefined) {
        updateData.applicantLocationRequirement =
          data.applicantLocationRequirement;
      }

      if (data.employmentType !== undefined)
        updateData.employmentType = data.employmentType;
      if (data.experienceLevel !== undefined)
        updateData.experienceLevel = data.experienceLevel;
      if (data.skills !== undefined) updateData.skills = data.skills;

      if (data.salary) {
        updateData.salary = {
          type: data.salary.type || jobPost.salary.type,
          currency: data.salary.currency || jobPost.salary.currency,
          unit: data.salary.unit || jobPost.salary.unit,
          amount: data.salary.amount,
          minAmount: data.salary.minAmount,
          maxAmount: data.salary.maxAmount,
        };
      }

      if (data.datePosted !== undefined)
        updateData.datePosted = data.datePosted;
      if (data.validThrough !== undefined)
        updateData.validThrough = data.validThrough;
      if (data.applyUrl !== undefined) updateData.applyUrl = data.applyUrl;
      if (data.aboutCompany !== undefined)
        updateData.aboutCompany = data.aboutCompany;
      if (data.metaDescription !== undefined)
        updateData.metaDescription = data.metaDescription;
      if ((data as any).status !== undefined)
        updateData.status = (data as any).status;

      const updatedJobPost = await JobPost.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true },
      );

      return {
        success: true,
        data: updatedJobPost,
      };
    } catch (error: any) {
      return {
        success: false,
        errors: [{ field: "general", message: error.message }],
      };
    }
  }

  /**
   * Delete job post (soft delete)
   */
  async deleteJobPost(id: string, userId: string) {
    try {
      await connectDB();

      const jobPost = await JobPost.findOneAndUpdate(
        { _id: id, userId },
        { $set: { isActive: false, status: "archived" } },
        { new: true },
      );

      if (!jobPost) {
        return {
          success: false,
          errors: [{ field: "general", message: "Job post not found" }],
        };
      }

      return {
        success: true,
        message: "Job post deleted successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        errors: [{ field: "general", message: error.message }],
      };
    }
  }
}
