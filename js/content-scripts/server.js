async function getCourseDataFromServer(id) {
    try {
        const res = await fetch(
            `https://www.udemy.com/api-2.0/courses/${id}/?fields[course]=created,title`,
            {
                method: "GET",
                headers: {},
            }
        );
        return await res.json();
    } catch (e) {
        console.warn("Error fetching creation date");
    }
}