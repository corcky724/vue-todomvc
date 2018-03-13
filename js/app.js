(function (window) {
	'use strict';

	// Your starting point. Enjoy the ride!

	var todos = [
		{ id: 1, title: 'Vue', completed: false},
		{ id: 2, title: 'Bootstrap4', completed: false},
		{ id: 3, title: 'English', completed: true},
	];

	// 封裝過濾 todos 的物件
	var filterObj = {
		// 全部
		all: function ( todos ) {
			return todos;
		},

		// 顯示未完成
		active: function ( todos ) {
			return todos.filter(function (todo) {
				return false === todo.completed;
			});
		},

		// 顯示已完成
		completed: function ( todos ) {
			return todos.filter(function (todo) {
				return true === todo.completed;
			});
		},
	};

	var app = new Vue({
		el: '#app',

		// 資料
		data: {
			todos: todos,

			// 新增的 todo title
			newTitle: '',

			// 當前修改的 todo
			editingTodo: null,

			// 當前 todos 顯示的過濾狀態
			visibility: 'all',

			// 全選
			toggleAll: false,
		},

		// 計算後的資料
		computed: {
			// 過濾
			filteredTodos: function () {
				return filterObj[this.visibility](this.todos);
			},

			// 已完成數量
			completeLength: function () {
				// 若不是 0 就代表示 true
				return filterObj.completed(this.todos).length;
			},
		},

		// 監視
		watch: {
			// 監視全選
			/**
			 * 解說
			 * 
			 * 監視 data 的 toggleAll 屬性。
			 * 
			 * 所以 watch 的屬性必須與 data 的屬性名稱相同。
			 * 
			 * 當 data 屬性改變時，會執行 watch 相應的函式。
			 * 
			 * 函式接收兩個參數，val 是當前 data 屬性值，oldVal 是 data 屬性值改變前的值。
			 */
			toggleAll: function (val, oldVal) {
				this.todos.forEach(function(todo) {
					todo.completed = val;
				});
			},
		},

		// 函式
		methods: {
			// 新增
			addTodo: function () {
				// 防止空白 title 新增
				if ( !this.newTitle ) return;

				var id = this.todos.length ? this.todos[this.todos.length - 1].id + 1 : 1;

				this.todos.push({
					id: id,
					title: this.newTitle,
					completed: false,
				});

				this.newTitle = '';
			},

			// 刪除
			removeTodo: function ( todo ) {
				this.todos.splice(this.todos.indexOf(todo), 1);
			},

			// 修改
			editTodo: function ( todo ) {
				// 防止同時修改多個
				if ( this.editingTodo ) return;

				this.editingTodo = todo;
			},

			// 保存
			save: function ( todo ) {
				this.editingTodo = null;

				// 修改完成後，若 title 為空則刪除
				if ( !todo.title ) {
					this.removeTodo( todo );
				};
			},

			// 刪除所有已完成
			removeCompleted: function () {
				this.todos = filterObj.active(this.todos);

				// 全選刪除後，取修全選勾選
				this.toggleAll = false;
			},
		},

		// 自訂指令
		/**
		 * 解說
		 * 
		 * 當 vue 讀取到 html 頁面上的自訂指令時，會執行自訂指令的函式。
		 * 
		 * el 是有設置自訂指令的元素。
		 * 
		 * binding 詳細用法不了解，猜測是自訂指令在這個元素上當前的參數集合。
		 * 
		 * binding.value 是有設置自訂指令的元素的自訂屬性的屬性值。
		 */
		directives: {
			'todo-focus': function (el, binding) {
				if ( true === binding.value ) {
					// 文本框元素獲取焦點。
					el.focus();
				};
			},
		},
	});

	// 哈希值事件
	function onHashChange () {
		/** 
		 * 方法與正規解說
		 * 
		 * replace(符合條件的字串, 新的字串) 字串方法，將新字串取代符合條件的字串，不影響調用該方法的字串。
		 * 
		 * 符合條件的目標字串: #/
		 * 
		 * 正規表達式:
		 * 
		 * 	# 號不需要轉譯
		 * 
		 * 	/ 號需要轉譯，所以需要寫成 \/
		 * 
		 * 	由於目標是相連的，可以使用小誇號包起當成一組 (#\/)
		 * 
		 * 	只需要尋找一個，在最後加上問號 (#\/)?
		*/
		var nowHash = window.location.hash.replace(/(#\/)?/, '');

		app.visibility = nowHash;
	};

	window.location.hash = '#/all';

	window.addEventListener('hashchange', onHashChange);

	window.app = app;

})(window);
