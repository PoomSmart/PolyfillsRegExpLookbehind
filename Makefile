include $(THEOS)/makefiles/common.mk

include $(THEOS_MAKE_PATH)/tweak.mk

ASSETS_PATH = layout/Library/Application Support/Polyfills

js:
	@for dir in scripts-priority scripts scripts-post; do \
		if [ -d "$$dir" ]; then \
			for file in $$dir/*.js; do \
				if [ -f "$$file" ]; then \
					base=$$(basename "$$file" .js); \
					npx babel "$$file" --out-file "$(ASSETS_PATH)/$$dir/16.4/$$base.js"; \
					npx uglify-js "$(ASSETS_PATH)/$$dir/16.4/$$base.js" -o "$(ASSETS_PATH)/$$dir/16.4/$$base.min.js"; \
					rm -f "$(ASSETS_PATH)/$$dir/16.4/$$base.js"; \
				fi; \
			done; \
		fi; \
	done
