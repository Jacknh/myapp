class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="ac-game-menu">
                <div class="ac-game-menu-field">
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
                        单人模式
                    </div>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
                        多人模式
                    </div>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
                        设置
                    </div>
                </div>
            </div>
        `);
        this.$menu.hide()
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');

        this.start();
    }

    start() {
        this.add_listenning_events();
    }

    add_listenning_events() {
        this.$single_mode.click(() => {
            this.hide();
            this.root.playground.show();
        });

        this.$multi_mode.click(() => {
            console.log("click multi mode");
        });

        this.$settings.click(() => {
            this.root.settings.logout_on_remote();
        })

    }

    show() {
        this.$menu.show();
    }

    hide() {
        this.$menu.hide();
    }


}
