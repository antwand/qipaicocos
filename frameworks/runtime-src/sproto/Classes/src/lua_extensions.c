
#include "lua_extensions.h"

#if __cplusplus
extern "C" {
#endif





	
	//lpeg
	#include "../lpeg/lptypes.h"
	#include "../lpeg/lpcap.h"
	#include "../lpeg/lpcode.h"
	#include "../lpeg/lpprint.h"
	#include "../lpeg/lptree.h"
	#include "../lpeg/lpvm.h"

	//sproto
	#include "../sproto/sproto.h"

	extern int luaopen_sproto_core(lua_State *L);
	extern int luaopen_lpeg(lua_State *L);
	

	/**
	在安卓中加入如下


	#skynet
	LOCAL_SRC_FILES += ../../../../external/lua/lpeg/lpcap.c \
	../../../../external/lua/lpeg/lpcode.c \
	../../../../external/lua/lpeg/lpprint.c \
	../../../../external/lua/lpeg/lptree.c \
	../../../../external/lua/lpeg/lpvm.c \
	../../../../external/lua/sproto/lsproto.c \
	../../../../external/lua/sproto/sproto.c


	***/


	static luaL_Reg luax_exts[] = {
		

		{ "lpeg", luaopen_lpeg },
		{ "sproto.core", luaopen_sproto_core},

		{ NULL, NULL }
	};

	void luaopen_sproto_lua_extensions(lua_State *L)
	{
		// load extensions
		luaL_Reg* lib = luax_exts;
		lua_getglobal(L, "package");
		lua_getfield(L, -1, "preload");
		for (; lib->func; lib++)
		{
			lua_pushcfunction(L, lib->func);
			lua_setfield(L, -2, lib->name);
		}
		lua_pop(L, 2);

		luaopen_luasocket_scripts(L);



	}


#if __cplusplus
} // extern "C"
#endif
