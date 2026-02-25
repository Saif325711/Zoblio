// Job form validation schema
export const validateJobForm = (data) => {
    const errors = {};

    // Basic Info
    if (!data.title?.trim()) errors.title = 'Job title is required';
    else if (data.title.trim().length < 5) errors.title = 'Title must be at least 5 characters';

    if (!data.category) errors.category = 'Please select a category';
    if (!data.type) errors.type = 'Please select a job type';
    if (!data.location?.trim()) errors.location = 'Location is required';

    if (data.salaryMin && data.salaryMax) {
        if (Number(data.salaryMin) >= Number(data.salaryMax)) {
            errors.salaryMax = 'Maximum salary must be greater than minimum';
        }
    }

    // Job Details
    if (!data.description?.trim()) errors.description = 'Job description is required';
    else if (data.description.trim().length < 100) errors.description = 'Description must be at least 100 characters';

    if (!data.experienceLevel) errors.experienceLevel = 'Please select experience level';

    // Application Settings
    if (!data.deadline) errors.deadline = 'Application deadline is required';
    else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(data.deadline) <= today) errors.deadline = 'Deadline must be a future date';
    }

    if (!data.openings || Number(data.openings) < 1) errors.openings = 'At least 1 opening is required';

    return errors;
};

export const isFormValid = (errors) => Object.keys(errors).length === 0;
