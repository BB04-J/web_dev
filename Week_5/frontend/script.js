document.addEventListener('DOMContentLoaded', () => {
	// Authentication Guard
	const token = localStorage.getItem('token');
	if (!token) {
		window.location.href = 'index.html';
		return;
	}

	// API Configuration
	const API_BASE = '';
	const authHeaders = {
		'Content-Type': 'application/json',
		'token': token
	};

	// UI Hook Elements
	const usernameDisplay = document.getElementById('usernameDisplay');
	const greetingTextDisplay = document.getElementById('greetingTextDisplay');
	const userAvatar = document.getElementById('userAvatar');
	const dashboardDate = document.getElementById('dashboardDate');
	const errorBanner = document.getElementById('errorBanner');
	const errorMsg = document.getElementById('errorMsg');
	const closeErrorBtn = document.getElementById('closeErrorBtn');
	const logoutBtn = document.getElementById('logoutBtn');
	
	const taskList = document.getElementById('taskList');
	const focusList = document.getElementById('focusList');
	const addTaskForm = document.getElementById('addTaskForm');
	const taskInput = document.getElementById('taskInput');
	const taskDaySelect = document.getElementById('taskDaySelect');
	const taskTimeInput = document.getElementById('taskTimeInput');
	const taskImportantCheckbox = document.getElementById('taskImportantCheckbox');
	
	const ring = document.querySelector('.progress-ring .ring-fg');
	const todayPercent = document.getElementById('todayPercent');
	const taskCountText = document.getElementById('taskCountText');
	const statusMessage = document.getElementById('statusMessage');
	const importantReminderBody = document.getElementById('importantReminderBody');
	const plannerTimeblocks = document.getElementById('plannerTimeblocks');
	const plannerWeekRange = document.getElementById('plannerWeekRange');
	const closePendingBtn = document.getElementById('closePendingBtn');

	// Local State
	let tasks = [];
	let selectedDate = ''; // YYYY-MM-DD format
	let searchFilter = '';
	let countdownInterval = null;
	let isPendingDismissed = false;
	let lastCheckedDateStr = getTodayDateString();

	// Error Handler
	function handleDatabaseError(error, defaultMsg = 'Database operation failed.') {
		console.error('Database/API Error:', error);
		let displayMessage = defaultMsg;
		if (error.message && error.message.includes('Failed to fetch')) {
			displayMessage = 'Could not connect to the database server. Please verify the backend is running.';
		} else if (error.message) {
			displayMessage = error.message;
		}
		errorMsg.textContent = displayMessage;
		errorBanner.classList.remove('hidden');
	}

	// Close Error Banner
	closeErrorBtn.addEventListener('click', () => {
		errorBanner.classList.add('hidden');
	});

	// Close Overdue/Pending Notification Card
	closePendingBtn.addEventListener('click', () => {
		isPendingDismissed = true;
		document.getElementById('pendingTasksCard').classList.add('hidden');
	});

	// Logout Button Handler
	logoutBtn.addEventListener('click', () => {
		localStorage.removeItem('token');
		window.location.href = 'index.html';
	});

	// Set Actual Date
	function formatTodayDate() {
		const options = { weekday: 'long', month: 'long', day: 'numeric' };
		const today = new Date();
		dashboardDate.textContent = today.toLocaleDateString('en-US', options).toUpperCase();
	}
	formatTodayDate();

	// Set Time-based Greeting
	function updateGreeting() {
		const hour = new Date().getHours();
		let greeting = 'Good morning';
		if (hour >= 12 && hour < 17) {
			greeting = 'Good afternoon';
		} else if (hour >= 17 || hour < 4) {
			greeting = 'Good evening';
		}
		greetingTextDisplay.textContent = greeting;
	}
	updateGreeting();

	// Helper to get today's date formatted as YYYY-MM-DD
	function getTodayDateString() {
		const today = new Date();
		const yyyy = today.getFullYear();
		const mm = String(today.getMonth() + 1).padStart(2, '0');
		const dd = String(today.getDate()).padStart(2, '0');
		return `${yyyy}-${mm}-${dd}`;
	}

	// Helper to find past days of this week relative to today
	function getPastDays() {
		const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
		const now = new Date();
		let currentDayIdx = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
		const mappedIdx = currentDayIdx === 0 ? 6 : currentDayIdx - 1;
		return daysOfWeek.slice(0, mappedIdx);
	}

	// Helper to calculate YYYY-MM-DD date based on day name MON-SUN of the current week
	function getDateForDayName(dayName) {
		if (!dayName) return '';
		const dayNames = { 'MON': 0, 'TUE': 1, 'WED': 2, 'THU': 3, 'FRI': 4, 'SAT': 5, 'SUN': 6 };
		const offset = dayNames[dayName];
		if (offset === undefined) return '';

		const now = new Date();
		const currentDayIdx = now.getDay();
		const monday = new Date(now);
		const diffToMonday = currentDayIdx === 0 ? -6 : 1 - currentDayIdx;
		monday.setDate(now.getDate() + diffToMonday);

		const targetDate = new Date(monday);
		targetDate.setDate(monday.getDate() + offset);

		const yyyy = targetDate.getFullYear();
		const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
		const dd = String(targetDate.getDate()).padStart(2, '0');
		return `${yyyy}-${mm}-${dd}`;
	}

	// Setup Weekly Planner Dynamic Dates and Click Actions
	function setupWeeklyPlanner() {
		const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
		const now = new Date();
		const currentDayIdx = now.getDay();
		
		const monday = new Date(now);
		const diffToMonday = currentDayIdx === 0 ? -6 : 1 - currentDayIdx;
		monday.setDate(now.getDate() + diffToMonday);

		const sundayOfThisWeek = new Date(monday);
		sundayOfThisWeek.setDate(monday.getDate() + 6);
		
		const startMonth = monday.toLocaleString('en-US', { month: 'short' });
		const endMonth = sundayOfThisWeek.toLocaleString('en-US', { month: 'short' });
		const year = now.getFullYear();
		
		let rangeText = '';
		if (startMonth === endMonth) {
			rangeText = `${startMonth} ${monday.getDate()} - ${sundayOfThisWeek.getDate()}, ${year}`;
		} else {
			rangeText = `${startMonth} ${monday.getDate()} - ${endMonth} ${sundayOfThisWeek.getDate()}, ${year}`;
		}
		plannerWeekRange.textContent = rangeText;

		// Set default selected date string YYYY-MM-DD to today's date
		const todayDateStr = getTodayDateString();
		if (!selectedDate) {
			selectedDate = todayDateStr;
		}

		const weekGrid = document.getElementById('weekGrid');
		weekGrid.innerHTML = '';
		
		for (let i = 0; i < 7; i++) {
			const dayDate = new Date(monday);
			dayDate.setDate(monday.getDate() + i);
			
			// Format this day card's date as YYYY-MM-DD
			const yyyy = dayDate.getFullYear();
			const mm = String(dayDate.getMonth() + 1).padStart(2, '0');
			const dd = String(dayDate.getDate()).padStart(2, '0');
			const dateStr = `${yyyy}-${mm}-${dd}`;
			
			const dayLabel = daysOfWeek[dayDate.getDay()];
			const dayDiv = document.createElement('div');
			dayDiv.className = 'day';
			
			if (dateStr === selectedDate) {
				dayDiv.classList.add('active');
			}

			dayDiv.innerHTML = `${dayLabel} <div class="date-num">${dayDate.getDate()}</div>`;
			
			// Click to select day and filter planner view
			dayDiv.addEventListener('click', () => {
				selectedDate = dateStr;
				document.querySelectorAll('.week-grid .day').forEach(d => d.classList.remove('active'));
				dayDiv.classList.add('active');
				renderPlannerTasks();
			});

			weekGrid.appendChild(dayDiv);
		}
	}

	// Progress Ring Setup
	const radius = ring.r.baseVal.value;
	const circumference = 2 * Math.PI * radius;
	ring.style.strokeDasharray = `${circumference} ${circumference}`;
	ring.style.strokeDashoffset = circumference;

	function setProgress(percent) {
		const offset = circumference - (percent / 100) * circumference;
		ring.style.strokeDashoffset = offset;
		todayPercent.textContent = Math.round(percent);
	}

	// Calculate Progress from Loaded Tasks
	function updateTaskProgress() {
		const total = tasks.length;
		const completed = tasks.filter(t => t.completed).length;
		
		const percent = total > 0 ? (completed / total) * 100 : 0;
		setProgress(percent);

		// Dynamic Weekly Score
		document.getElementById('weeklyScoreText').textContent = `${Math.round(percent)}%`;

		// Dynamic Productivity Streak (0 for new users, 1 if they have completed tasks)
		document.getElementById('streakNumDisplay').textContent = completed > 0 ? 1 : 0;

		taskCountText.textContent = `${completed}/${total} tasks completed`;
		
		if (total === 0) {
			statusMessage.textContent = 'Add some tasks to start!';
		} else if (percent === 100) {
			statusMessage.textContent = 'All tasks completed! Amazing job! 🎉';
		} else if (percent >= 75) {
			statusMessage.textContent = 'Almost there! Keep going!';
		} else if (percent >= 50) {
			statusMessage.textContent = 'Halfway done! You got this!';
		} else {
			statusMessage.textContent = 'On track!';
		}
	}

	// Render Planner Tasks (Dynamic date-based scheduler, shows both completed and uncompleted tasks)
	function renderPlannerTasks() {
		plannerTimeblocks.innerHTML = '';
		const dayTasks = tasks.filter(t => t.date === selectedDate);
		const colors = ['blue', 'purple', 'green'];

		dayTasks.forEach((task, index) => {
			const colorClass = colors[index % colors.length];
			const block = document.createElement('div');
			block.className = `block ${colorClass}`;
			
			if (task.completed) {
				block.style.opacity = '0.55';
				block.style.textDecoration = 'line-through';
			}

			const timeLabel = task.timeSlot ? task.timeSlot : 'Anytime';
			const completedSuffix = task.completed ? ' (Done)' : '';
			block.innerHTML = `<strong>${task.title}</strong>${completedSuffix}<br><span class="small">${timeLabel}</span>`;
			plannerTimeblocks.appendChild(block);
		});

		if (dayTasks.length === 0) {
			const dateParts = selectedDate.split('-');
			const d = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
			const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
			plannerTimeblocks.innerHTML = `<div class="block" style="background:#f3f4f6; color:#9ca3af; text-align:center; flex:1;">All clear! No tasks scheduled for ${dayName}.</div>`;
		}
	}

	// Helper to parse a task's target date and time
	function getTaskTargetDate(task) {
		if (!task.date) return null;
		
		const dateParts = task.date.split('-');
		const year = parseInt(dateParts[0]);
		const month = parseInt(dateParts[1]) - 1; // 0-indexed
		const day = parseInt(dateParts[2]);

		let targetHour = 10; // default 10 AM
		let targetMinute = 0;

		if (task.timeSlot) {
			const match = task.timeSlot.match(/(\d+)(?::(\d+))?\s*(AM|PM)?/i);
			if (match) {
				let hr = parseInt(match[1]);
				let min = match[2] ? parseInt(match[2]) : 0;
				let ampm = match[3] ? match[3].toUpperCase() : '';
				if (ampm === 'PM' && hr < 12) hr += 12;
				if (ampm === 'AM' && hr === 12) hr = 0;
				targetHour = hr;
				targetMinute = min;
			}
		}

		return new Date(year, month, day, targetHour, targetMinute, 0, 0);
	}

	// Render "Upcoming Important" Tasks with countdown timelines
	function renderImportantCountdown() {
		if (countdownInterval) {
			clearInterval(countdownInterval);
		}

		// Find all uncompleted important tasks
		const importantTasks = tasks.filter(t => t.isImportant && !t.completed);

		if (importantTasks.length === 0) {
			importantReminderBody.innerHTML = '<div class="muted" style="padding:10px 0;">No upcoming important tasks. Mark a task as Important to see it here.</div>';
			return;
		}

		// Calculate target dates
		importantTasks.forEach(t => {
			t.targetDate = getTaskTargetDate(t);
		});

		// Sort: tasks with target dates first (chronological order), then "Anytime" tasks
		importantTasks.sort((a, b) => {
			if (a.targetDate && b.targetDate) {
				return a.targetDate - b.targetDate;
			}
			if (a.targetDate) return -1;
			if (b.targetDate) return 1;
			return 0;
		});

		// Render list
		importantReminderBody.innerHTML = importantTasks.map(task => {
			const timeLabel = task.day ? `${task.day}${task.timeSlot ? ', ' + task.timeSlot : ''}` : 'Anytime';
			return `
				<div class="important-item" style="border-bottom: 1px solid rgba(99, 90, 120, 0.08); padding: 10px 0; display: flex; justify-content: space-between; align-items: center;">
					<div style="flex: 1; padding-right: 8px;">
						<div class="reminder-title" style="font-size: 13px; font-weight: 700; color: #111827; line-height: 1.3;">${task.title}</div>
						<div class="reminder-time muted" style="font-size: 11px; margin-top: 2px;">${timeLabel}</div>
					</div>
					<div class="countdown" id="countdown-${task._id}" style="font-weight: 700; color: var(--accent); font-size: 14px; font-family: monospace; min-width: 65px; text-align: right;">--:--:--</div>
				</div>
			`;
		}).join('');

		// Remove border from the last item for cleaner look
		const items = importantReminderBody.querySelectorAll('.important-item');
		if (items.length > 0) {
			items[items.length - 1].style.borderBottom = 'none';
		}

		function tick() {
			const now = new Date();
			importantTasks.forEach(task => {
				const countdownEl = document.getElementById(`countdown-${task._id}`);
				if (!countdownEl) return;

				if (!task.targetDate) {
					countdownEl.textContent = 'Anytime';
					countdownEl.style.color = '#9ca3af';
					return;
				}

				let diff = task.targetDate - now;
				if (diff <= 0) {
					countdownEl.textContent = '00:00:00';
					countdownEl.style.color = '#ef4444';
					return;
				}

				const hrs = Math.floor(diff / 3600000);
				const mins = Math.floor((diff % 3600000) / 60000);
				const secs = Math.floor((diff % 60000) / 1000);
				countdownEl.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
				countdownEl.style.color = 'var(--accent)';
			});
		}

		tick();
		countdownInterval = setInterval(tick, 1000);
	}

	// Render Tasks to DOM
	function renderTasks() {
		taskList.innerHTML = '';
		focusList.innerHTML = '';

		const todayDateStr = getTodayDateString();

		// Search filtering
		const query = searchFilter.toLowerCase().trim();
		const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(query));

		filteredTasks.forEach(task => {
			// Create main list item
			const li = document.createElement('li');
			if (task.completed) li.classList.add('done');

			const label = document.createElement('label');
			label.className = 'task-list-label';

			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.className = 'task-checkbox';
			checkbox.checked = task.completed;
			checkbox.addEventListener('change', () => toggleTask(task._id, checkbox.checked));

			const titleSpan = document.createElement('span');
			titleSpan.textContent = ` ${task.title}`;

			label.appendChild(checkbox);
			label.appendChild(titleSpan);

			// Append tags/badges dynamically
			if (task.isImportant) {
				const impSpan = document.createElement('span');
				impSpan.className = 'priority high';
				impSpan.style.background = '#fef3c7';
				impSpan.style.color = '#d97706';
				impSpan.style.fontSize = '10px';
				impSpan.style.padding = '2px 6px';
				impSpan.style.marginLeft = '6px';
				impSpan.style.borderRadius = '8px';
				impSpan.style.fontWeight = '700';
				impSpan.textContent = '⭐ Important';
				label.appendChild(impSpan);
			}

			if (task.day) {
				const daySpan = document.createElement('span');
				daySpan.className = 'tag';
				daySpan.style.background = '#f5effc';
				daySpan.style.color = '#7b4eff';
				daySpan.style.fontSize = '10px';
				daySpan.style.padding = '2px 6px';
				daySpan.style.marginLeft = '6px';
				daySpan.style.borderRadius = '8px';
				daySpan.style.fontWeight = '600';
				daySpan.textContent = task.day;
				label.appendChild(daySpan);
			}

			if (task.timeSlot) {
				const timeSpan = document.createElement('span');
				timeSpan.className = 'tag';
				timeSpan.style.background = '#e0f2fe';
				timeSpan.style.color = '#0369a1';
				timeSpan.style.fontSize = '10px';
				timeSpan.style.padding = '2px 6px';
				timeSpan.style.marginLeft = '6px';
				timeSpan.style.borderRadius = '8px';
				timeSpan.style.fontWeight = '600';
				timeSpan.textContent = `🕒 ${task.timeSlot}`;
				label.appendChild(timeSpan);
			}

			const deleteBtn = document.createElement('button');
			deleteBtn.className = 'delete-task-btn';
			deleteBtn.innerHTML = '❌';
			deleteBtn.ariaLabel = 'Delete task';
			deleteBtn.addEventListener('click', () => deleteTask(task._id));

			li.appendChild(label);
			li.appendChild(deleteBtn);
			taskList.appendChild(li);
		});

		// Populate Focus list (Uncompleted and Important tasks go here)
		const focusTasks = tasks.filter(t => !t.completed && t.isImportant && (!t.day || t.date === todayDateStr) && t.title.toLowerCase().includes(query));
		
		focusTasks.forEach(task => {
			const focusLi = document.createElement('li');
			focusLi.className = 'task';
			focusLi.draggable = true;

			const focusLabel = document.createElement('label');
			focusLabel.className = 'task-list-label';

			const focusCheckbox = document.createElement('input');
			focusCheckbox.type = 'checkbox';
			focusCheckbox.className = 'task-checkbox';
			focusCheckbox.checked = false;
			focusCheckbox.addEventListener('change', () => toggleTask(task._id, true));

			const focusTitleSpan = document.createElement('span');
			focusTitleSpan.textContent = ` ${task.title}`;

			focusLabel.appendChild(focusCheckbox);
			focusLabel.appendChild(focusTitleSpan);

			if (task.day) {
				const tagSpan = document.createElement('span');
				tagSpan.className = 'tag';
				tagSpan.style.background = '#f2f6ff';
				tagSpan.style.color = '#4669ff';
				tagSpan.textContent = task.day;
				focusLabel.appendChild(tagSpan);
			}
			
			const focusImpSpan = document.createElement('span');
			focusImpSpan.className = 'priority high';
			focusImpSpan.textContent = 'High';
			
			focusLabel.appendChild(focusImpSpan);
			focusLi.appendChild(focusLabel);
			focusList.appendChild(focusLi);
		});

		if (focusTasks.length === 0) {
			focusList.innerHTML = '<li class="muted" style="padding:14px; text-align:center; color:#9ca3ad; font-size:13px; list-style:none;">No high priority focus items. Mark a task as Important to see it here!</li>';
		}

		// Render Overdue & Pending previous day tasks (Absolute date-based comparison)
		const pendingTasksList = document.getElementById('pendingTasksList');
		const pendingTasksCard = document.getElementById('pendingTasksCard');
		pendingTasksList.innerHTML = '';

		const pastDays = getPastDays();

		// Filter tasks that are uncompleted, and scheduled before today
		const pendingTasks = tasks.filter(t => {
			if (t.completed) return false;
			if (!t.title.toLowerCase().includes(query)) return false;
			
			// If task has an absolute date, compare it
			if (t.date) {
				return t.date < todayDateStr;
			}
			// If task has no absolute date, check if its scheduled day name is in the past
			if (t.day) {
				return pastDays.includes(t.day);
			}
			return false;
		});

		// Sort pending tasks date-wise (oldest first)
		const daySortOrder = { 'MON': 1, 'TUE': 2, 'WED': 3, 'THU': 4, 'FRI': 5, 'SAT': 6, 'SUN': 7 };
		pendingTasks.sort((a, b) => {
			if (a.date && b.date) {
				return a.date.localeCompare(b.date);
			}
			if (a.date) return -1;
			if (b.date) return 1;
			
			const orderA = daySortOrder[a.day] || 99;
			const orderB = daySortOrder[b.day] || 99;
			return orderA - orderB;
		});

		pendingTasks.forEach(task => {
			const li = document.createElement('li');
			li.className = 'pending-task-item task-list-item';

			const label = document.createElement('label');
			label.className = 'task-list-label';

			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.className = 'task-checkbox';
			checkbox.checked = false;
			checkbox.addEventListener('change', () => toggleTask(task._id, true));

			const titleSpan = document.createElement('span');
			titleSpan.textContent = ` ${task.title}`;

			label.appendChild(checkbox);
			label.appendChild(titleSpan);

			// Format absolute date for display safely
			let overdueText = `${task.day} (Overdue)`;
			if (task.date) {
				const dateParts = task.date.split('-');
				const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
				const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
				overdueText = `${task.day}, ${formattedDate} (Overdue)`;
			}

			const overdueTag = document.createElement('span');
			overdueTag.className = 'tag';
			overdueTag.style.background = '#fee2e2';
			overdueTag.style.color = '#ef4444';
			overdueTag.style.fontSize = '10px';
			overdueTag.style.padding = '2px 6px';
			overdueTag.style.marginLeft = '6px';
			overdueTag.style.borderRadius = '8px';
			overdueTag.style.fontWeight = '700';
			overdueTag.textContent = overdueText;
			label.appendChild(overdueTag);

			const deleteBtn = document.createElement('button');
			deleteBtn.className = 'delete-task-btn';
			deleteBtn.innerHTML = '❌';
			deleteBtn.addEventListener('click', () => deleteTask(task._id));

			li.appendChild(label);
			li.appendChild(deleteBtn);
			pendingTasksList.appendChild(li);
		});

		if (pendingTasks.length > 0 && !isPendingDismissed) {
			pendingTasksCard.classList.remove('hidden');
		} else {
			pendingTasksCard.classList.add('hidden');
		}

		renderPlannerTasks();
		renderImportantCountdown();
		updateTaskProgress();
	}

	// Connect top search bar to filter tasks in real-time
	const searchInput = document.querySelector('.search');
	searchInput.addEventListener('input', (e) => {
		searchFilter = e.target.value;
		renderTasks();
	});

	// Fetch User Profile
	async function loadUserProfile() {
		try {
			const res = await fetch(`${API_BASE}/user/me`, {
				method: 'GET',
				headers: authHeaders
			});

			if (res.status === 401) {
				// Expired or bad token
				localStorage.removeItem('token');
				window.location.href = 'auth.html';
				return;
			}

			const data = await res.json();
			if (!res.ok) throw new Error(data.message);

			usernameDisplay.textContent = data.username;
			userAvatar.textContent = data.username.charAt(0).toUpperCase();
		} catch (error) {
			handleDatabaseError(error, 'Failed to fetch user profile.');
		}
	}

	// Fetch Tasks from MongoDB
	async function loadTasks() {
		try {
			const res = await fetch(`${API_BASE}/todo`, {
				method: 'GET',
				headers: authHeaders
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message);

			tasks = data.map(t => {
				if (t.day && !t.date) {
					t.date = getDateForDayName(t.day);
				}
				return t;
			});
			setupWeeklyPlanner();
			renderTasks();
		} catch (error) {
			handleDatabaseError(error, 'Failed to fetch task list from database.');
		}
	}

	// Add Task to MongoDB
	addTaskForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		const title = taskInput.value.trim();
		const day = taskDaySelect.value;
		const date = getDateForDayName(day); // YYYY-MM-DD
		const timeSlot = taskTimeInput.value.trim();
		const isImportant = taskImportantCheckbox.checked;

		if (!title) {
			handleDatabaseError(new Error('Task title is required.'), 'Validation Error');
			return;
		}
		if (!day) {
			alert('Please select a scheduled day for the task.');
			handleDatabaseError(new Error('Please select a scheduled day for the task.'), 'Validation Error');
			return;
		}

		try {
			const res = await fetch(`${API_BASE}/todo`, {
				method: 'POST',
				headers: authHeaders,
				body: JSON.stringify({ title, completed: false, isImportant, day, date, timeSlot })
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Failed to create task.');

			tasks.push(data);
			
			// Clear fields
			taskInput.value = '';
			taskDaySelect.value = '';
			taskTimeInput.value = '';
			taskImportantCheckbox.checked = false;

			renderTasks();
		} catch (error) {
			handleDatabaseError(error, 'Failed to save task to database.');
		}
	});

	// Toggle Task Completion in MongoDB
	async function toggleTask(id, completed) {
		const task = tasks.find(t => t._id === id);
		if (!task) return;

		try {
			const res = await fetch(`${API_BASE}/todo`, {
				method: 'PUT',
				headers: authHeaders,
				body: JSON.stringify({ 
					id, 
					title: task.title, 
					completed,
					isImportant: task.isImportant,
					day: task.day,
					date: task.date,
					timeSlot: task.timeSlot
				})
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Failed to update task.');

			task.completed = completed;
			renderTasks();
		} catch (error) {
			handleDatabaseError(error, 'Failed to update task status in database.');
		}
	}

	// Delete Task from MongoDB
	async function deleteTask(id) {
		try {
			const res = await fetch(`${API_BASE}/todo/${id}`, {
				method: 'DELETE',
				headers: authHeaders
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message || 'Failed to delete task.');
			}

			tasks = tasks.filter(t => t._id !== id);
			renderTasks();
		} catch (error) {
			handleDatabaseError(error, 'Failed to delete task from database.');
		}
	}

	// Check for day rollover (e.g., if user leaves page open overnight)
	function checkDayRollover() {
		const currentDateStr = getTodayDateString();
		if (currentDateStr !== lastCheckedDateStr) {
			lastCheckedDateStr = currentDateStr;
			selectedDate = currentDateStr;
			formatTodayDate();
			updateGreeting();
			loadTasks();
		}
	}
	// Check every 10 seconds
	setInterval(checkDayRollover, 10000);
	// Also check when tab becomes active/focused
	window.addEventListener('focus', checkDayRollover);

	// Initialize Data
	loadUserProfile();
	loadTasks();
});
