# This file is generated by gyp; do not edit.

TOOLSET := target
TARGET := sx_camera
DEFS_Debug := \
	'-DNODE_GYP_MODULE_NAME=sx_camera' \
	'-DUSING_UV_SHARED=1' \
	'-DUSING_V8_SHARED=1' \
	'-DV8_DEPRECATION_WARNINGS=1' \
	'-DV8_DEPRECATION_WARNINGS' \
	'-DV8_IMMINENT_DEPRECATION_WARNINGS' \
	'-D_GLIBCXX_USE_CXX11_ABI=1' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-D__STDC_FORMAT_MACROS' \
	'-DOPENSSL_NO_PINSHARED' \
	'-DOPENSSL_THREADS' \
	'-DNAPI_DISABLE_CPP_EXCEPTIONS' \
	'-DBUILDING_NODE_EXTENSION' \
	'-DDEBUG' \
	'-D_DEBUG' \
	'-DV8_ENABLE_CHECKS'

# Flags passed to all source files.
CFLAGS_Debug := \
	-fPIC \
	-pthread \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-g \
	-O0

# Flags passed to only C files.
CFLAGS_C_Debug :=

# Flags passed to only C++ files.
CFLAGS_CC_Debug := \
	-fno-rtti \
	-std=gnu++17

INCS_Debug := \
	-I/root/.cache/node-gyp/18.20.6/include/node \
	-I/root/.cache/node-gyp/18.20.6/src \
	-I/root/.cache/node-gyp/18.20.6/deps/openssl/config \
	-I/root/.cache/node-gyp/18.20.6/deps/openssl/openssl/include \
	-I/root/.cache/node-gyp/18.20.6/deps/uv/include \
	-I/root/.cache/node-gyp/18.20.6/deps/zlib \
	-I/root/.cache/node-gyp/18.20.6/deps/v8/include \
	-I/home/pi/OASCController/node_modules/node-addon-api

DEFS_Release := \
	'-DNODE_GYP_MODULE_NAME=sx_camera' \
	'-DUSING_UV_SHARED=1' \
	'-DUSING_V8_SHARED=1' \
	'-DV8_DEPRECATION_WARNINGS=1' \
	'-DV8_DEPRECATION_WARNINGS' \
	'-DV8_IMMINENT_DEPRECATION_WARNINGS' \
	'-D_GLIBCXX_USE_CXX11_ABI=1' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-D__STDC_FORMAT_MACROS' \
	'-DOPENSSL_NO_PINSHARED' \
	'-DOPENSSL_THREADS' \
	'-DNAPI_DISABLE_CPP_EXCEPTIONS' \
	'-DBUILDING_NODE_EXTENSION'

# Flags passed to all source files.
CFLAGS_Release := \
	-fPIC \
	-pthread \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-O3 \
	-fno-omit-frame-pointer

# Flags passed to only C files.
CFLAGS_C_Release :=

# Flags passed to only C++ files.
CFLAGS_CC_Release := \
	-fno-rtti \
	-std=gnu++17

INCS_Release := \
	-I/root/.cache/node-gyp/18.20.6/include/node \
	-I/root/.cache/node-gyp/18.20.6/src \
	-I/root/.cache/node-gyp/18.20.6/deps/openssl/config \
	-I/root/.cache/node-gyp/18.20.6/deps/openssl/openssl/include \
	-I/root/.cache/node-gyp/18.20.6/deps/uv/include \
	-I/root/.cache/node-gyp/18.20.6/deps/zlib \
	-I/root/.cache/node-gyp/18.20.6/deps/v8/include \
	-I/home/pi/OASCController/node_modules/node-addon-api

OBJS := \
	$(obj).target/$(TARGET)/sx-camera.o

# Add to the list of files we specially track dependencies for.
all_deps += $(OBJS)

# Make sure our dependencies are built before any of us.
$(OBJS): | $(builddir)/nothing.a $(obj).target/../node_modules/node-addon-api/nothing.a

# CFLAGS et al overrides must be target-local.
# See "Target-specific Variable Values" in the GNU Make manual.
$(OBJS): TOOLSET := $(TOOLSET)
$(OBJS): GYP_CFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_C_$(BUILDTYPE))
$(OBJS): GYP_CXXFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_CC_$(BUILDTYPE))

# Suffix rules, putting all outputs into $(obj).

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(srcdir)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# Try building from generated source, too.

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj).$(TOOLSET)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# End of this set of suffix rules
### Rules for final target.
LDFLAGS_Debug := \
	-pthread \
	-rdynamic

LDFLAGS_Release := \
	-pthread \
	-rdynamic

LIBS := \
	-lusb-1.0

$(obj).target/sx_camera.node: GYP_LDFLAGS := $(LDFLAGS_$(BUILDTYPE))
$(obj).target/sx_camera.node: LIBS := $(LIBS)
$(obj).target/sx_camera.node: TOOLSET := $(TOOLSET)
$(obj).target/sx_camera.node: $(OBJS) $(obj).target/../node_modules/node-addon-api/nothing.a FORCE_DO_CMD
	$(call do_cmd,solink_module)

all_deps += $(obj).target/sx_camera.node
# Add target alias
.PHONY: sx_camera
sx_camera: $(builddir)/sx_camera.node

# Copy this to the executable output path.
$(builddir)/sx_camera.node: TOOLSET := $(TOOLSET)
$(builddir)/sx_camera.node: $(obj).target/sx_camera.node FORCE_DO_CMD
	$(call do_cmd,copy)

all_deps += $(builddir)/sx_camera.node
# Short alias for building this executable.
.PHONY: sx_camera.node
sx_camera.node: $(obj).target/sx_camera.node $(builddir)/sx_camera.node

# Add executable to "all" target.
.PHONY: all
all: $(builddir)/sx_camera.node

