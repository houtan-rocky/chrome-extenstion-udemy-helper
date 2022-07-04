async function renderTitle() {
	const id = document.body.getAttribute(`data-clp-course-id`);
	const courseData = await getCourseDataFromServer(id);
	const creationDateTime = new Date(courseData["created"]);
	const creationDate = creationDateTime.toLocaleDateString();
	const courseTitle = document.querySelector('[data-purpose="lead-title"]');
	courseTitle.innerHTML += `<br> <span style="color: green"> Creation Date: ${creationDate} </span>`;
	return 0;
}


setTimeout(() => {
	renderTitle().catch(() => console.warn('Can not render creation date.'));
}, 2000);
