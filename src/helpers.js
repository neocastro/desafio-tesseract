export const filterMembers = (filterTerm, members) =>
    members.filter(
        m => m.login.toLowerCase().includes(filterTerm.toLowerCase())
    )

export const formatDate = (dateStr) => {
    const raw = new Date(dateStr)
    return raw.getDate() + "/" + (raw.getMonth() + 1) + "/" + raw.getFullYear()    
}