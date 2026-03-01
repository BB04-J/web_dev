class ToDo {
    constructor() {
        this.todos = [];
    }
    add(todo) {
        this.todos.push(todo);
    }
    remove(indexoftodo) {
        this.todos.splice(indexoftodo, 1);
    }
    update(index, updatedtodo) {
        this.todos[index] = updatedtodo;
    }
    getAll() {
        return this.todos;
    }
    get(indexoftodo) {
        return this.todos[indexoftodo];
    }
    clear() {
        this.todos.length = 0;
    }

}

const readline = require("readline");
const r = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const t = new ToDo();
function menu()
{
    console.log("type \n 1. To add TO DO \n 2. To remove a TO DO \n 3. Update a TO DO \n 4.view all TO DO \n 5.Clear all TO DO \n 6. In case want o exit");
    r.question("Enter the choice", function (choice) {
        switch (choice) {
            case "1":
                r.question("Enter the TO DO to be added", function (todo) {
                    t.add(todo);
                    console.log("Added!");
                    menu();

                });
                break;
            case "2":
                r.question("Enter index of TO DO to be removed", function (index) {
                    t.remove(index);
                    console.log("Removed!");
                    menu();
                });
                break;
            case "3":
                r.question("Enter the index to update the TO DO", function (index) {
                    r.question("Enter the TO DO to be updated", function (todo) {

                        t.update(index, todo);
                        console.log("Updated!");
                        menu();


                    });
                });
                break;
            case "4":
                console.log("TO DO are :   ", t.getAll());
                menu();
                break;
            case "5":
                t.clear();
                console.log("TO DO(s) ALL CLEARED!");
                menu();
                break;

            case "6":
                r.close();
                break;

            default:
                console.log("INVALID CHOICE");


        }

    })
}
menu();


