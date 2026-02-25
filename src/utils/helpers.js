export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const formatSalary = (min, max) => {
    return `$${(min / 1000).toFixed(0)}K - $${(max / 1000).toFixed(0)}K`;
};

export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};
